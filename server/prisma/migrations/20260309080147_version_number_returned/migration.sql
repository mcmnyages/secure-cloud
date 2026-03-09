/*
  Warnings:

  - A unique constraint covering the columns `[fileId,versionNumber]` on the table `FileVersion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `versionNumber` to the `FileVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileVersion" ADD COLUMN     "versionNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_fileId_versionNumber_key" ON "FileVersion"("fileId", "versionNumber");
