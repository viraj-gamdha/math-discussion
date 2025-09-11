//  Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}