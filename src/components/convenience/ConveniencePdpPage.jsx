import { useEffect, useMemo, useState } from "react";
import ConvenienceCategoryTabs from "./ConvenienceCategoryTabs.jsx";
import ConvenienceHeader from "./ConvenienceHeader.jsx";
import ConvenienceProductGrid from "./ConvenienceProductGrid.jsx";
import ConvenienceSearchBar from "./ConvenienceSearchBar.jsx";
import BottomNavigation from "../BottomNavigation.jsx";
import { parseConvenienceCsv } from "../../utils/parseConvenienceCsv.js";

const csvUrl = "/data/convenience_store_promotion_all.csv";

export default function ConveniencePdpPage({
  initialFilter = "all",
  onBack,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  onOpenAuth,
}) {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(csvUrl);

        if (!response.ok) {
          throw new Error("CSV 파일을 불러오지 못했어요.");
        }

        const csvText = await response.text();
        const parsedProducts = parseConvenienceCsv(csvText);

        if (!ignore) {
          setProducts(parsedProducts);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "상품 데이터를 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return products.filter((product) => {
      const matchesEvent =
        activeFilter === "all" || product.event_type === activeFilter;
      const matchesSearch =
        !keyword || product.product_name.toLowerCase().includes(keyword);

      return matchesEvent && matchesSearch;
    });
  }, [activeFilter, products, searchValue]);

  return (
    <main className="page-shell">
      <section className="convenience-frame" aria-label="Community_convenience_pdp_all">
        <ConvenienceHeader onBack={onBack} onOpenAuth={onOpenAuth} />
        <section className="convenience-content">
          <ConvenienceSearchBar value={searchValue} onChange={setSearchValue} />
          <ConvenienceCategoryTabs
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
          <ConvenienceProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
          />
        </section>
        <BottomNavigation
          onOpenMap={onOpenMap}
          onOpenCommunity={onOpenCommunity}
          onOpenGroupbuy={onOpenGroupbuy}
          onOpenMyPage={onOpenMyPage}
        />
      </section>
    </main>
  );
}
