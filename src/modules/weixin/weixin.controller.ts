import { All, Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { WeixinService } from "./weixin.service";
import { Response } from "express";
import { Public } from "@/common/decorators/public.decorators";
import * as qiniu from "qiniu";
const accessKey = "wdntybJN3zmzuf55O7mDQYxg9xzLwB8lbVenpRf-";
const secretKey = "w755ePz7a0zZDZaZMVydtAuqITd88dg6d0m2npV7";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

@Controller("weixin")
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}
  @Public()
  @All("check")
  async list(@Res() res: Response) {
    // {
    //   signature: 'd1d2c1a871d846f77052256dd5337c21244d22b3',
    //   timestamp: '1675148427',
    //   nonce: '129746778',
    //   openid: 'oQooa48dmMb3Qk7Ln7h63Pb-BxCg',
    //   encrypt_type: 'aes',
    //   msg_signature: '2a19a936532f8b75e71379618db49fa9f920f5d1'
    // } ======  推送消息
    // {
    //   signature: 'd217e099548697be35ead5a76677bd9d8adea7e5',
    //   echostr: '2234323323185593534',
    //   timestamp: '1675148430',
    //   nonce: '886401799'
    // } ====== 校验

    res.status(HttpStatus.OK).send(res.req.query.echostr);
  }

  @Get("token")
  async token() {
    const options = {
      scope: "supfamily",
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken
  }
}
