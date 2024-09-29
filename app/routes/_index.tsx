import { json } from "@remix-run/node";
import ProductsPage from "../src/ProductsPage";
import data from "../../data/data.json";

async function getProducts() {
  return data;
}

export type ProductLoader = typeof loader;

export async function loader() {
  const products = await getProducts();
  return json(products);
}

export default function Products() {
  return <ProductsPage />;
}
