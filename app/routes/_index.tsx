import prisma  from "../../prisma/prisma";
import { json } from "@remix-run/node";
import ProductsPage from "../src/ProductsPage";

async function getProducts() {
  const products = await prisma.product.findMany();
  return products;
}

export type ProductLoader = typeof loader;

export async function loader() {
  const products = await getProducts();
  return json(products);
}

export default function Products() {
  return <ProductsPage />;
}