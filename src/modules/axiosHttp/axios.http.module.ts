import { Module } from "@nestjs/common";
import { HttpModule } from "nestjs-http-promise";
import { AxiosHttpService } from "./axios.http.service";
@Module({
  imports: [
    HttpModule.register({
      retries: 0,
    }),
  ],
  controllers: [],
  providers: [AxiosHttpService],
  exports: [AxiosHttpService],
})
export class AxiosHttpModule {}
