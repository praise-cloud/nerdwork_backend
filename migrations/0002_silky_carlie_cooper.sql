
ALTER TABLE user_wallets
ALTER COLUMN nwt_balance TYPE integer USING nwt_balance::integer;

ALTER TABLE user_wallets
ALTER COLUMN nwt_locked_balance TYPE integer USING nwt_locked_balance::integer;

ALTER TABLE user_wallets
ALTER COLUMN spending_limit_daily TYPE integer USING spending_limit_daily::integer;

ALTER TABLE user_wallets
ALTER COLUMN spending_limit_monthly TYPE integer USING spending_limit_monthly::integer;


