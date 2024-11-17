import Typesense from "typesense";

const typesense = () => {
  return new Typesense.Client({
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY!,
    nodes: [
      {
        url: process.env.NEXT_PUBLIC_TYPESENSE_URL!,
      },
    ],
    connectionTimeoutSeconds: 5,
  });
};

export default typesense;