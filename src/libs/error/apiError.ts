export class ApiError extends Error {
  public statusCode: number

  toJson

  constructor(statusCode: number, message: string, stack = '') {
    if (typeof message !== 'string') {
      const lastError = message[message.length - 1]
      const { value, property, constraints } = lastError

      message = `property=${property}, value=${value}, message=${constraints[Object.keys(constraints)[0]]}`
    }

    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    if (stack) {
      this.stack = stack
    } else {
      // @ts-ignore
      Error.captureStackTrace?.(this, this.constructor)
    }

    this.toJson = () => {
      return {
        header: {
          resultCode: this.statusCode,
          resultMessage: this.message,
        },
      }
    }
  }
}
