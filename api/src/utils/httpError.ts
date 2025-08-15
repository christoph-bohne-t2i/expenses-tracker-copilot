export class HttpError extends Error {
  status: number;
  title: string;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.title = HttpError.defaultTitle(status);
    this.details = details;
  }

  private static defaultTitle(status: number) {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return titles[status] || 'Error';
  }
}
