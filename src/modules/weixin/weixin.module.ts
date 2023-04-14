import { Module } from "@nestjs/common";
import { AxiosHttpModule } from "@/modules/axiosHttp/axios.http.module";
import { WeixinController } from "./weixin.controller";
import { WeixinService } from "./weixin.service";
@Module({
  imports: [AxiosHttpModule],
  controllers: [WeixinController],
  providers: [WeixinService],
  exports: [WeixinService],
})
export class WeixinModule {}
