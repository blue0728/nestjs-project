import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CustomException } from "../http/customException";

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const date =
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
    let errorResponse: Record<string, any> = {
      errcode: httpStatus,
      errmsg: exception.message,
      url: request.originalUrl,
      date: date,
    };

    if (exception instanceof CustomException) {
      // 自定义异常
      errorResponse = {
        errcode: exception.getErrorCode() || 10000,
        errmsg: exception.getErrorMessage(),
        data: exception.getErrorData(),
        url: request.originalUrl,
        date: date,
      };
    }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.OK;
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header("Content-Type", "application/json; charset=utf-8");
    response.send(errorResponse);
  }
}
