export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
  stockQuantity: number;
  inStock: boolean;
  imageUrls: string[];
  imageUrl: string | null;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  sellerName: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string | null;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrl: string | null;
}

export interface CheckoutResponse {
  orderId: number;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "SHIPPED"
  | "DELIVERED";

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  reviewerName: string;
  createdAt: string;
}

export interface ProductRating {
  averageRating: number;
  reviewCount: number;
  canReview: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
