/*
  Warnings:

  - You are about to drop the column `email` on the `Proveedores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Proveedores` DROP COLUMN `email`,
    ADD COLUMN `correo` VARCHAR(191) NULL;
