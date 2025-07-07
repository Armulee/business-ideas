-- Add replica identity to Session table for logical replication
ALTER TABLE "Session" REPLICA IDENTITY USING INDEX "Session_sessionToken_key";

-- Add replica identity to other tables that might need it
ALTER TABLE "Account" REPLICA IDENTITY USING INDEX "Account_pkey";
ALTER TABLE "VerificationToken" REPLICA IDENTITY USING INDEX "VerificationToken_pkey";
ALTER TABLE "Authenticator" REPLICA IDENTITY USING INDEX "Authenticator_pkey";
ALTER TABLE "users" REPLICA IDENTITY USING INDEX "users_pkey";