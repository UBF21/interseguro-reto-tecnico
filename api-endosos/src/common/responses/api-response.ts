export class ApiResponse<T> {
  success: boolean;
  message: string | null;
  code: string | null;
  data: T | null;

  static ok<T>(data: T | null, message: string | null = null): ApiResponse<T> {
    return Object.assign(new ApiResponse<T>(), { success: true, message, code: null, data });
  }

  static fail<T>(message: string, data: T | null = null, code: string | null = null): ApiResponse<T> {
    return Object.assign(new ApiResponse<T>(), { success: false, message, code, data });
  }
}
