import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";

const prisma = new PrismaClient();
const directoryPath = path.resolve(import.meta.dirname, "import-data");
const allItems = processJsonFiles(directoryPath);

// Function to read and parse JSON files
function readJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// Function to get all JSON files from a directory
function getJsonFilesFromDirectory(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .filter((file) => path.extname(file).toLowerCase() === ".json")
    .map((file) => path.join(directoryPath, file));
}

// Main function to process all JSON files
function processJsonFiles(directoryPath) {
  const jsonFiles = getJsonFilesFromDirectory(directoryPath);
  let allItems = [];

  for (const file of jsonFiles) {
    const items = readJsonFile(file);
    allItems = allItems.concat(items);
  }

  return allItems;
}

async function uploadProducts(products) {
  const uniqueProducts = _.uniqBy(products, "sku");
  const uniqueSkus = uniqueProducts.map((product) => product.sku);
  const existingProducts = await prisma.product.findMany({
    where: {
      sku: {
        in: uniqueSkus,
      },
    },
  });

  const existingProductsBySku = _.keyBy(existingProducts, "sku");

  const data = [];
  for (const product of uniqueProducts) {
    if (existingProductsBySku[product.sku]) continue;
    const productData = {
      sku: product.sku,
      title: product.title,
      price: product.price,
      link: product.link,
      pricePerUnit: product.unit,
      imageUrl: product.imgSrc,
    };
    data.push(productData);
  }

  await prisma.product.createMany({
    data,
  });
}

uploadProducts(allItems)
  .then(() => {
    console.log("Products uploaded successfully");
  })
  .catch((error) => {
    console.error("Error uploading products", error);
  });
