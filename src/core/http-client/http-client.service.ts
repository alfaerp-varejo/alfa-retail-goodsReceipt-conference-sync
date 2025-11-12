import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

@Injectable()
export class HttpClientService {

    private axiosInstance: AxiosInstance;
    private logger = new Logger(HttpClientService.name);

    constructor(private readonly configService: ConfigService) {
        const env = this.configService.get();
        const baseURL = env.BTP_VAREJO_URL;

        this.setBaseUrl(baseURL);
    }

    setBaseUrl(baseURL?: string) {

        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private buildConfig(config?: AxiosRequestConfig, token?: string): AxiosRequestConfig {

        if (!token || token === "")
            throw Error("Token não informado");

        return {
            ...config,
            headers: {
                ...config?.headers,
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async get<T = any>(url: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
        const finalConfig = this.buildConfig(config, token);

        this.logger.debug(`[GET] Request ${this.axiosInstance.getUri()}${url}`);

        const response = await this.axiosInstance.get<T>(url, finalConfig);
        return response.data;
    }

    async post<T = any>(
        url: string,
        data: any,
        token?: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {

            const finalConfig = this.buildConfig(config, token);

            const response = await this.axiosInstance.post<T>(url, data, finalConfig);
            console.log(response, "response");

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async put<T = any>(
        url: string,
        data: any,
        token?: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const finalConfig = this.buildConfig(config, token);
        const response = await this.axiosInstance.put<T>(url, data, finalConfig);
        return response.data;
    }

    async patch<T = any>(
        url: string,
        data: any,
        token?: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const finalConfig = this.buildConfig(config, token);
        const response = await this.axiosInstance.patch<T>(url, data, finalConfig);
        return response.data;
    }
}