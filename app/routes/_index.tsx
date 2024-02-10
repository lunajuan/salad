import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LinksFunction } from "@remix-run/react/dist/routeModules";
import IngredientsSection, {
  links as ingredientsSectionlinks,
} from "src/IngredientsSection";
import saladData from "src/salad-data";

export const links: LinksFunction = () => [...ingredientsSectionlinks()];

export const loader = async () => {
  return json(saladData);
};

export const meta: MetaFunction = () => {
  return [
    { title: "Salads" },
    { name: "description", content: "Salad Generator" },
  ];
};

export default function Index() {
  const saladData = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Salads</h1>
      <h2>Ingredients</h2>
      <IngredientsSection saladData={saladData} />
    </div>
  );
}
