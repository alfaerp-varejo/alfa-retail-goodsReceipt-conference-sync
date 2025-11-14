export interface Document {
    DocEntry?: number;
    DocNum?: number;
    DocDate?: Date;
    CardCode?: string;
    CardName?: string;
    NumAtCard?: string;
    BPL_IDAssignedToInvoice?: number;
    U_GCV_id_venda_pdv?: string;
    Reference2?: string;
    Comments?: string;
    SequenceCode?: number;
    SequenceSerial?: number;
    SeriesString?: string;
    SequenceModel?: string;
    PaymentGroupCode?: number;
    DocTotal?: number;
    TransNum?: number;
    U_ChaveAcesso?: string;
    DocumentLines?: DocumentLine[];
}

export interface DocumentLine {
    LineNum?: number;
    ItemCode?: string;
    Quantity?: number;
    DiscountPercent?: number;
    CostingCode?: string;
    ProjectCode?: string;
    FreeText?: string;
    MeasureUnit?: string;
    LineTotal?: number;
    Usage?: number;
    UnitPrice?: number;
    Text?: string;
    CostingCode2?: string;
    CostingCode3?: string;
    CostingCode4?: string;
    CostingCode5?: string;
    U_GCV_id_venda_pdv?: string;
    U_GCV_lineId_venda_pdv?: number;
    U_GCV_quantity_checked?: number;
    U_GCV_divergent_quantity?: number;
    U_GCV_checked_comments?: string;
}