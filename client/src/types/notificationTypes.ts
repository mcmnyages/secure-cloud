/** Fully generic notification — no assumptions */
export interface Notification<TMeta = unknown> {
  id: string;
  userId: string;
  type: string; // completely backend-driven
  title: string;
  message: string;
  meta: TMeta | null;
  isRead: boolean;
  createdAt: string; // ISO date string
}


/** Generic API response wrapper */
export interface ApiResponse<TData> {
  success: boolean;
  data: TData;
}

/** Concrete response type */


export interface PaginatedResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type NotificationsResponse = {
  success: boolean;
  data: PaginatedResponse<Notification[]>;
};