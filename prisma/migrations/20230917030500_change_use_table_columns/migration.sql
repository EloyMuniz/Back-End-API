/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `use_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "use_password" TEXT NOT NULL,
ALTER COLUMN "use_token" SET DEFAULT '';
