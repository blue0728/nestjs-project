import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Response } from "@/common/interceptors/response";
import { HttpFilter } from "@/common/filters/httpFilter";
import { logger } from "@/common/middleware/logger.middleware";
import { JwtAuthGuard } from "@/common/guards/auth.guard";
import { Reflector } from "@nestjs/core";
import * as dotenv from "dotenv";
import { urlencoded, json } from "express";
dotenv.config();

const PORT = process.env.PORTS || 8787;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useGlobalInterceptors(new Response());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.useGlobalFilters(new HttpFilter());
  app.setGlobalPrefix('/api', {exclude: ['/weixin/check','healthcheck']})

  await app.listen(PORT);
}

bootstrap();
