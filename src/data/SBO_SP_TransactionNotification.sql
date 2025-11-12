CREATE PROCEDURE SBO_SP_TransactionNotification
(
	in object_type nvarchar(30), 				-- SBO Object Type
	in transaction_type nchar(1),			-- [A]dd, [U]pdate, [D]elete, [C]ancel, C[L]ose
	in num_of_cols_in_key int,
	in list_of_key_cols_tab_del nvarchar(255),
	in list_of_cols_val_tab_del nvarchar(255)
)
LANGUAGE SQLSCRIPT
AS
-- Return values
error  int;				-- Result (0 for no error)
error_message nvarchar (200); 		-- Error string to be displayed
begin

error := 0;
error_message := N'Ok';

--------------------------------------------------------------------------------------------------------------------------------

--	ADD	YOUR	CODE	HERE

--------------------------------------------------------------------------------------------------------------------------------

IF (:object_type = '1' AND :transaction_type = 'U')
THEN
    
    UPDATE OACT SET "U_GCV_flag_replicate" = NULL WHERE "AcctCode" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = '2' AND :transaction_type = 'U')
THEN
    
    UPDATE OCRD SET "U_GCV_flag_replicate" = NULL WHERE "CardCode" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = '4' AND :transaction_type = 'U')
THEN
    
    UPDATE OITM SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "ItemCode" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = '40' AND :transaction_type = 'U')
THEN
    
    UPDATE OCTG SET "U_GCV_flag_replicate" = NULL WHERE "GroupNum" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_BRANDS' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_BRANDS" SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_CATEGORIES' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_CATEGORIES" SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_COLLECTIONS' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_COLLECTIONS" SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_GRIDS' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_GRIDS" SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_COLORS' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_COLORS" SET "U_GCV_flag_pdv" = NULL, "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;

IF (:object_type = 'GCV_SPECIF' AND :transaction_type = 'U')
THEN
    
    UPDATE "@GCV_SPECIF" SET "U_GCV_flag_replicate" = NULL WHERE "Code" = :list_of_cols_val_tab_del;
	
END IF;


-- Select the return values
select :error, :error_message FROM dummy;

end;