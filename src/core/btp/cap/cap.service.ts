import { ConfigService } from "src/core/config/config.service";
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CapService {

    private readonly logger = new Logger(CapService.name);
    private token: string | null = null;
    private tokenExpires = 0;

    constructor(private readonly configService: ConfigService) { }

    private async getAccessToken(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpires) {
            return this.token;
        }

        const BtpConfig = this.configService.getBtpConfig();

        const data = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: BtpConfig.clientId,
            client_secret: BtpConfig.secret,
        });

        const response = await axios.post(BtpConfig.tokenUrl, data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        this.token = response.data.access_token || '';
        this.tokenExpires = Date.now() + (response.data.expires_in * 1000 - 60000); // refresh 1 min before
        this.logger.log('Novo token BTP obtido.');

        return this.token || '';
    }

    async getHeaders() {
        const token = await this.getAccessToken();
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }
}
