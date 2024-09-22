import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  // Success Response Function
  successResponse(
    data: any,
    status: boolean,
    message: string,
    statusCode: number,
  ) {
    return {
      status,
      message: message ? message : 'Success',
      statusCode,
      data,
    };
  }

  // Error Response Function
  errorResponse(
    status: boolean,
    message: string,
    statusCode: number,
    errors: any = null,
  ) {
    return {
      status: 'error',
      message: message ? message : 'An error occurred',
      statusCode,
      errors,
    };
  }
}
