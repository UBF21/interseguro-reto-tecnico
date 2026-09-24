namespace ApiAuth.Application.Common;

public record ApiResponse<T>
{
    public required bool Success { get; init; }
    public string? Message { get; init; }
    public string? Code { get; init; }
    public T? Data { get; init; }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Message = message, Data = data };

    public static ApiResponse<T> Fail(string message, T? data = default, string? code = null) =>
        new() { Success = false, Message = message, Data = data, Code = code };
}
