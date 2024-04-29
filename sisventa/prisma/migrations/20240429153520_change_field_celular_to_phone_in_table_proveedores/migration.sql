/*
  Warnings:

  - You are about to drop the column `celular` on the `Proveedores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Proveedores` DROP COLUMN `celular`,
    ADD COLUMN `telefono` VARCHAR(191) NULL;
