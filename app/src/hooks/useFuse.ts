import { useState, useEffect, useMemo } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

const useFuse = <T>({
  data,
  searchQuery,
  initialOptions,
}: {
  data: T[];
  searchQuery: string;
  initialOptions: IFuseOptions<T>;
}) => {
  const [results, setResults] = useState<T[]>([]);
  const [options, setOptions] = useState(initialOptions);

  // Create a new Fuse instance whenever data or options change
  const fuse = useMemo(() => {
    return new Fuse(data, options);
  }, [data, options]);

  useEffect(() => {
    if (searchQuery) {
      const results = fuse.search(searchQuery).map((result) => result.item);
      setResults(results);
    } else {
      setResults(data); // Return all data if searchQuery is empty
    }
  }, [data, fuse, searchQuery]);

  return { results, setOptions };
};

export default useFuse;
