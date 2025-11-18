SELECT
    T0."DocEntry" AS "DocNum",
    T0."DocNum" AS "DocNum",
    T1."DocEntry" AS "DraftKey"
FROM "{0}".OPCH T0
    INNER JOIN ODRF T1 ON T1."DocEntry" = T0."draftKey"
WHERE
    T0."CANCELED" = 'N'
    AND T1."DocEntry" = {1}