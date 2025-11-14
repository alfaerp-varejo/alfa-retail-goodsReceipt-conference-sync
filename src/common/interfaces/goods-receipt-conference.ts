import { UUID } from "crypto";

export interface GoodsReceiptConference {
    ID?: UUID;
    code?: string;
    docEntry?: number;
    docNum?: number;
    serial?: number;
    docDate?: Date;
    cardCode?: string;
    cardName?: string;
    taxId4?: string;
    slpCode?: number;
    slpName?: string;
    bplCode?: number;
    bplName?: string;
    docEntryOrder?: number;
    docNumOrder?: number;
    totalNf?: number;
    totalItens?: number;
    chaveAcesso?: string;
    conferenceStatus?: string;
    notaGerada?: string;
    status_code?: string;
    statusApproval_code?: string;
    comments?: string;
    codeBars?: string;
    totalChecked?: number;

    _itens?: GoodsReceiptConferenceItem[];
}

export interface GoodsReceiptConferenceItem {
    ID?: UUID;
    code_ID?: UUID;
    _product?: any;
    reference?: string;
    product_code?: string;
    quantityChecked?: number;
    divergentQuantity?: number;

    comments?: string;

    quantity?: number;
    unitPrice?: number;
    total?: number;
    baseLine?: number;

    _status?: any;
    status_code?: string;
    beeped?: string;
}
