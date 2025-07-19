-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_history" JSONB[] DEFAULT ARRAY[]::JSONB[];
