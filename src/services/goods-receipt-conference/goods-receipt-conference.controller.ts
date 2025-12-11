import { Body, Controller, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { GoodsReceiptConferenceService } from "./goods-receipt-conference.service";

interface GoodsReceiptConferenceDto {
    chaveAcesso: string;
}

@Controller('goodsReceiptConference')
export class GoodsReceiptConferenceController {
    private logger = new Logger(GoodsReceiptConferenceController.name);

    constructor(private readonly service: GoodsReceiptConferenceService) { }

    @Post('run')
    run() {
        return this.service.process();
    }

    @Post('test')
    async runManualmente(@Body() body: GoodsReceiptConferenceDto) {
        let { chaveAcesso } = body;

        if (!chaveAcesso) {
            chaveAcesso = '';
        }

        try {
            this.logger.log(`Requisição recebida: integração de conferencia por chave de acesso ${chaveAcesso}`);

            // Fire and forget
            this.service
                .manualProcess(chaveAcesso)
                .then(() => this.logger.log(`Integração finalizada para ${chaveAcesso}.`))
                .catch(err => this.logger.error(`Erro na integração: ${err.message}`));

            // Retorna imediatamente
            return {
                success: true,
                message: "Integração iniciada em background.",
                chaveAcesso
            };
        } catch (error: any) {
            this.logger.error(`Erro ao iniciar integração: ${error.message}`);
            throw new HttpException(
                {
                    success: false,
                    message: "Erro ao iniciar integração.",
                    details: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}