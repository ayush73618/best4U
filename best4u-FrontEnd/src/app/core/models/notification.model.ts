export interface Notification {
  id: number;
  type: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
