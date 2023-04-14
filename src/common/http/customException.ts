import { HttpException, HttpStatus } from "@nestjs/common";
/**
 * 自定义异常
 */
export class CustomException extends HttpException {
  private errmsg: string;
  private errcode: number;
  private data: any;
  constructor(
    errmsg: string,
    errcode?: number,
    data?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(errmsg, statusCode);
    this.data = data;
    this.errmsg = errmsg;
    this.errcode = errcode;
  }

  getErrorCode(): number {
    return this.errcode;
  }

  getErrorMessage(): string {
    return this.errmsg;
  }

  getErrorData(): any {
    return this.data;
  }
}
