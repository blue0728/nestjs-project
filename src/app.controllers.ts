import { Controller, Get, All, HttpStatus, Query, Res } from "@nestjs/common";
import { Public } from "@/common/decorators/public.decorators";
import { Response } from "express";
@Public()
@Controller("/")
export class AppController {
  @Get("healthcheck")
  async healthcheck(@Res() res: Response) {
    res.status(HttpStatus.OK).json("ok");
  }
}
