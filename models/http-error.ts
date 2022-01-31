interface HttpError extends Error {
  code: number;
}

class HttpError extends Error {
  constructor(message: string, errorCode: number) {
    super(message); // add "message" property
    this.code = errorCode;
  }
}

module.exports = HttpError;
