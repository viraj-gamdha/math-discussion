export type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};
