/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `use_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "use_id",
ADD COLUMN     "use_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("use_uuid");
