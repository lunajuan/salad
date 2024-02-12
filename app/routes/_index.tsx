import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LinksFunction } from "@remix-run/react/dist/routeModules";
import IngredientsSection, {
  links as ingredientsSectionlinks,
} from "src/IngredientsSection";
import SaladGenerator, {
  links as saladGeneratorLinks,
} from "src/SaladGenerator";
import saladData from "src/salad-data";

export const links: LinksFunction = () => [
  ...ingredientsSectionlinks(),
  ...saladGeneratorLinks(),
];

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
    <div>
      <div className="main-section">
        <h2>Create a Salad</h2>
        <SaladGenerator saladData={saladData} />
      </div>
      <div className="main-section">
        <h2 className="heading">Ingredients</h2>
        <IngredientsSection saladData={saladData} />
      </div>
    </div>
  );
}
