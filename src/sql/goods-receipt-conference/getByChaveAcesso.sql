SELECT
    "CHAVEACESSO" AS "ChaveAcesso",
    "DOCENTRY" AS "DocEntry",
    "DOCNUM" AS "DocNum",
    "DOCDATE" AS "DocDate",
    "TAXDATE" AS "TaxDate",
    "CARDCODE" AS "CardCode",
    "CARDNAME" AS "CardName",
    "TAXID4" AS "TaxId4",
    "SLPCODE" AS "SlpCode",
    "SLPNAME" AS "SlpName",
    "BPLCODE" AS "BplCode",
    "BPLNAME" AS "BPLName",
    "DOCENTRYORDER" AS "DocEntryOrder",
    "DOCNUMORDER" AS "DocNumOrder",
    "TOTALNF" AS "TotalNf",
    "TOTALITENS" AS "TotalItens",
    "SERIAL" AS "Serial",
    "ETIQUETADO" AS "Etiquetado"
FROM
    "_SYS_BIC"."{0}.ALFA_RETAIL_BTP/GOODS_RECEIPT_CONFERENCE" T0
WHERE
    "CHAVEACESSO" = '{1}'