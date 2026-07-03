import Papa from "papaparse";

export function parseConvenienceCsv(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error("CSV 데이터를 읽는 중 문제가 발생했어요.");
  }

  return result.data.filter(
    (product) => product.brand_name && product.product_name,
  );
}
