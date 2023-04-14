import { Injectable } from "@nestjs/common";
import { HttpService } from "nestjs-http-promise";
import { CustomException } from "@/common/http/customException";
import { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { has } from "lodash";

const exception = (errmsg: string, errcode: number) => {
  throw new CustomException(errmsg, errcode);
};

@Injectable()
export class AxiosHttpService {
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        console.log(error, "AxiosError>>>");
      }
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        if (has(response.data, "errcode")) {
          if (response.data.errcode === 0) {
            return Promise.resolve(response.data);
          } else {
            console.log(response.data)
            const { errmsg, errcode } = response.data;
            exception(errmsg, errcode);
          }
        } else {
          return Promise.resolve(response.data);
        }
      },
      (error: AxiosError) => {
        const errmsg =
          error.message ||
          error.response?.data?.message ||
          error.response?.statusText;
        const errcode =
          error.code || error.response?.data?.code || error.response?.status;
        exception(errmsg, errcode);
      }
    );
  }

  get(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.httpService.get(url, {
      params: data,
      ...config,
    });
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.httpService.post(url, data, config);
  }
}
