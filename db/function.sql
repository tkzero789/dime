CREATE OR REPLACE FUNCTION public.add_transaction(
    p_type text,
    p_name text,
    p_amount numeric,
    p_category text,
    p_payment_source text,
    p_date timestamp without time zone,
    p_created_by text
) 
RETURNS jsonb 
LANGUAGE plpgsql 
AS $function$
DECLARE 
    result JSONB;
    v_account_type TEXT;
BEGIN
    -- 1. Get account type and verify ownership
    SELECT type 
    INTO v_account_type 
    FROM account 
    WHERE id = p_payment_source::uuid 
      AND created_by = p_created_by;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Account not found or unauthorized';
    END IF;

    -- 2. Update account available balance/credit
    UPDATE account 
    SET amount = COALESCE(amount, 0) - p_amount 
    WHERE id = p_payment_source::uuid 
      AND created_by = p_created_by;

    -- 3. Additionally, update debt for credit accounts
    IF v_account_type = 'credit' THEN
        UPDATE account 
        SET debt = COALESCE(debt, 0) + p_amount 
        WHERE id = p_payment_source::uuid 
          AND created_by = p_created_by;
    END IF;

    -- 4. Insert transaction record
    INSERT INTO transaction (
        type,
        name, 
        amount, 
        category, 
        payment_source, 
        date, 
        created_by
    ) 
    VALUES (
        p_type,
        p_name, 
        p_amount, 
        p_category, 
        p_payment_source, 
        p_date, 
        p_created_by
    ) 
    RETURNING to_jsonb(transaction.*) INTO result;

    RETURN result;
END;
$function$;