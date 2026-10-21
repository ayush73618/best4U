export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string | null;
  roles: string[];
  sellerStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ProfileResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string | null;
  roles: string[];
  sellerStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SellerApplicationRequest {
  shopName: string;
  businessType: string;
  primaryCategory: string;
  businessPhone: string;
  businessAddress: string;
  gstNumber: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiId: string;
  whyDoYouWantToSell: string;
}

export interface SellerProfileResponse {
  shopName: string;
  businessType: string;
  primaryCategory: string;
  businessPhone: string;
  businessAddress: string;
  gstNumber: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiId: string;
  whyDoYouWantToSell: string;
}