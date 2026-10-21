package com.best4u.backend.order.service.impl;

import com.best4u.backend.cart.entity.CartItem;
import com.best4u.backend.cart.repository.CartRepository;
import com.best4u.backend.common.ApiException;
import com.best4u.backend.notification.service.NotificationService;
import com.best4u.backend.order.dto.CheckoutResponse;
import com.best4u.backend.order.dto.OrderMapper;
import com.best4u.backend.order.dto.OrderResponse;
import com.best4u.backend.order.dto.PaymentVerificationRequest;
import com.best4u.backend.order.entity.Order;
import com.best4u.backend.order.entity.OrderItem;
import com.best4u.backend.order.entity.OrderStatus;
import com.best4u.backend.order.repository.OrderItemRepository;
import com.best4u.backend.order.repository.OrderRepository;
import com.best4u.backend.order.service.OrderService;
import com.best4u.backend.payment.service.RazorpayService;
import com.best4u.backend.product.entity.Product;
import com.best4u.backend.product.repository.ProductRepository;
import com.best4u.backend.security.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RazorpayService razorpayService;
    private final NotificationService notificationService;

    public OrderServiceImpl(CartRepository cartRepository, ProductRepository productRepository,
                             OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                             RazorpayService razorpayService,NotificationService notificationService) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.razorpayService = razorpayService;
        this.notificationService= notificationService;
    }

    @Override
    @Transactional
    public CheckoutResponse checkout() {
        Long userId = AuthUtil.currentUserId();
        List<CartItem> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Your cart is empty.");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(0.0);
        order = orderRepository.save(order);

        double total = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "A product in your cart no longer exists."));

            int updated = productRepository.decrementStockIfAvailable(product.getId(), cartItem.getQuantity());
            if (updated == 0) {
                throw new ApiException(HttpStatus.CONFLICT,
                        "\"" + product.getName() + "\" doesn't have enough stock left. Please update your cart.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setProductName(product.getName());
            orderItem.setImageUrl(
            	    product.getImageUrls().isEmpty() ? null : product.getImageUrls().get(0)
            	);
            orderItems.add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }

        orderItemRepository.saveAll(orderItems);
        order.setTotalAmount(total);
        orderRepository.save(order);
        cartRepository.deleteByUserId(userId);

        try {
            var razorpayOrder = razorpayService.createOrder(total, "order_" + order.getId());
            order.setRazorpayOrderId(razorpayOrder.get("id"));
            orderRepository.save(order);

            return CheckoutResponse.builder()
                    .orderId(order.getId())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .razorpayKeyId(razorpayService.publicKeyId())
                    .amount(total)
                    .build();
        } catch (Exception e) {
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not initiate payment. Please try again.");
        }
    }

    @Override
    @Transactional
    public void verifyPayment(PaymentVerificationRequest request) {
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found."));

        try {
            boolean valid = razorpayService.verifySignature(
                    request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

            if (!valid) {
                order.setStatus(OrderStatus.FAILED);
                orderRepository.save(order);
                throw new ApiException(HttpStatus.BAD_REQUEST, "Payment verification failed.");
            }

            order.setStatus(OrderStatus.PAID);
            order.setRazorpayPaymentId(request.getRazorpayPaymentId());
            orderRepository.save(order);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not verify payment.");
        }
    }

    @Override
    public Page<OrderResponse> listMine(Pageable pageable) {
        Long userId = AuthUtil.currentUserId();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(order -> OrderMapper.toResponse(order, orderItemRepository.findByOrderId(order.getId())));
    }

    @Override
    @Transactional
    public void restockAbandonedOrders() {
        Instant cutoff = Instant.now().minus(30, ChronoUnit.MINUTES);
        List<Order> abandoned = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutoff);

        for (Order order : abandoned) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                productRepository.incrementStock(item.getProductId(), item.getQuantity());
            }
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }
    
    @Override
    @Transactional
    public void updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "Order not found."));

        // Guard against invalid transitions. PAID is the only status
        // an admin should be advancing from — you can't ship something
        // that was never paid for or was already delivered.
        boolean validTransition = switch (order.getStatus()) {
            case PAID -> newStatus == OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == OrderStatus.DELIVERED;
            default -> false;
        };

        if (!validTransition) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Cannot move an order from " + order.getStatus()
                            + " to " + newStatus + ".");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        String message = newStatus == OrderStatus.SHIPPED
                ? "Your order #" + order.getId() + " has been shipped!"
                : "Your order #" + order.getId() + " has been delivered!";
        notificationService.create(order.getUserId(), newStatus.name(), message, "/shop/orders");
    }
}