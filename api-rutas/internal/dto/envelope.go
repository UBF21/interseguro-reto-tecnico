package dto

// ApiResponse[T] -- mismo contrato que api-auth (.NET) y api-endosos (Node): success/message/code/data.
type ApiResponse[T any] struct {
	Success bool    `json:"success"`
	Message *string `json:"message"`
	Code    *string `json:"code"`
	Data    *T      `json:"data"`
}

func Ok[T any](data T) ApiResponse[T] {
	return ApiResponse[T]{Success: true, Data: &data}
}

func Fail[T any](message string, code string) ApiResponse[T] {
	return ApiResponse[T]{Success: false, Message: &message, Code: &code}
}
