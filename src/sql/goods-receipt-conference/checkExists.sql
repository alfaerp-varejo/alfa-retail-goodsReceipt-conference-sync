SELECT
    COUNT(T0."DocEntry") AS "contador"
FROM
    "{0}"."OPCH" T0
WHERE
    T0."Serial" = '{1}'
    AND T0."U_ChaveAcesso" = '{2}'
    AND T0."BPLId" = {3}
    AND COALESCE(T0."draftKey", -1) <> -1;