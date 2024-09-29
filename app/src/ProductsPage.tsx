import { useLoaderData } from "@remix-run/react";
import { ProductLoader } from "../routes/_index";
import useFuse from "./hooks/useFuse";
import { useEffect, useState } from "react";
import { useCopyToClipboard, useDebounceCallback } from "usehooks-ts";

export default function ProductPage() {
  const [, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  const products = useLoaderData<ProductLoader>();
  const [searchQuery, setSearchQuery] = useState("");

  // local search but will be useful when we need server side search
  const updateSearchQuery = useDebounceCallback((query: string) => {
    setSearchQuery(query);
  }, 200);

  const { results } = useFuse({
    data: products,
    searchQuery,
    initialOptions: {
      keys: ["title", "description"],
    },
  });
  return (
    <main className="relative">
      {isCopied && (
        <p className="font-semibold text-white absolute top-4 left-4 z-20 bg-emerald-500 rounded-full px-4 py-2">
          copied text!
        </p>
      )}
      <div className="flex items-center justify-center gap-4 sticky top-0 bg-white z-10 border-b border-gray-300 px-4 py-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <input
          type="text"
          placeholder="Search products"
          className="py-2 px-4 border border-gray-300 rounded-full w-full max-w-md"
          onChange={(e) => updateSearchQuery(e.target.value)}
        />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 px-4 py-12">
        {results.map((product) => {
          return (
            <li key={product.id} className="block text-sm">
              <div className="flex gap-2">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-24 object-contain"
                />
                <div className="flex flex-col gap-1 flex-grow">
                  <p className="line-clamp-3 leading-tight">{product.title}</p>
                  <ProductPrice
                    price={product.price}
                    pricePerUnit={product.pricePerUnit}
                  />
                  {product.link && (
                    <div className="flex flex-col gap-2 items-center">
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500"
                      >
                        View on Amazon
                      </a>
                      <button
                        onClick={() => {
                          if (!product.link) return;
                          copy(product.link).then(() => {
                            setIsCopied(true);
                          });
                        }}
                        className="border border-gray-300 rounded-full px-2 py-1"
                      >
                        copy amazon link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function ProductPrice({
  price,
  pricePerUnit,
}: {
  price: number;
  pricePerUnit?: string | null;
}) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
  if (pricePerUnit) {
    return (
      <p className="text-gray-500 font-semibold">
        {formattedPrice} /{pricePerUnit}
      </p>
    );
  }
  return <p className="font-semibold">{formattedPrice}</p>;
}
