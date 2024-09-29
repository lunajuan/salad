import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const pathToExportData = path.resolve(import.meta.dirname, "../data/data.json");

async function exportData() {
  const data = await prisma.product.findMany();
  // save locally as json
  fs.writeFileSync(pathToExportData, JSON.stringify(data, null, 2));
}

exportData();
