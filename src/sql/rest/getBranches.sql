SELECT
	 "ID" as "bplId",
	 "NAME" as "bplName",
	 "MAIN" as "main",
	 "LIST_NUM" as "listNum",
	 "LIST_NAME" as "listName",
	 TO_NVARCHAR("TOKEN") as "token",
	 "PDV_ID" as "pdvId"
FROM "_SYS_BIC"."GCV_PDV.ALFA_RETAIL_PDV/BRANCHES" 