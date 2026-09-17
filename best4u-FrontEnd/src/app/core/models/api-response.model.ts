// Mirrors the backend's Best4UResponse<T> envelope exactly.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}