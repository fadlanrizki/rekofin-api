/*
  Warnings:

  - Added the required column `investment` to the `financial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `financial` ADD COLUMN `investment` DOUBLE NOT NULL;
