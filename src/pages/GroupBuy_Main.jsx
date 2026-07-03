import { useMemo, useState } from "react";
import GroupBuyHeader from "../components/groupbuy/GroupBuyHeader.jsx";
import GroupBuySearchBar from "../components/groupbuy/GroupBuySearchBar.jsx";
import GroupBuyPopularSection from "../components/groupbuy/GroupBuyPopularSection.jsx";
import GroupBuyCategoryTabs from "../components/groupbuy/GroupBuyCategoryTabs.jsx";
import GroupBuyProductList from "../components/groupbuy/GroupBuyProductList.jsx";
import GroupBuyBottomNav from "../components/groupbuy/GroupBuyBottomNav.jsx";
import { groupbuyProducts } from "../data/groupbuyMainData.js";
import { saveFavoriteIds } from "../utils/groupbuyFavorites.js";

export default function GroupBuyMain({
  onOpenProductDetail,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  onOpenAuth,
  favoriteProductIds = [],
  onFavoriteIdsChange,
}) {
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");

  const visibleProducts = useMemo(() => {
    const tabFilteredProducts =
      activeTab === "전체"
        ? groupbuyProducts
        : groupbuyProducts.filter((product) => product.category === activeTab);

    if (!normalizedSearchQuery) return tabFilteredProducts;

    return tabFilteredProducts.filter((product) =>
      [product.title, product.category, product.groupPrice, product.originalPrice]
        .join(" ")
        .toLocaleLowerCase("ko-KR")
        .includes(normalizedSearchQuery),
    );
  }, [activeTab, normalizedSearchQuery]);

  const handleToggleFavorite = (productId) => {
    const nextIds = favoriteProductIds.includes(productId)
      ? favoriteProductIds.filter((id) => id !== productId)
      : [...favoriteProductIds, productId];

    saveFavoriteIds(nextIds);
    onFavoriteIdsChange?.(nextIds);
  };

  return (
    <main className="groupbuy-page-shell">
      <section className="groupbuy-frame" aria-label="GroupBuy main">
        <GroupBuyHeader onOpenAuth={onOpenAuth} />
        <section className="groupbuy-content">
          <GroupBuySearchBar value={searchQuery} onChange={setSearchQuery} />
          <GroupBuyPopularSection onOpenProductDetail={onOpenProductDetail} />
          <section className="groupbuy-feed-section" aria-label="공동구매 상품">
            <GroupBuyCategoryTabs
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <GroupBuyProductList
              products={visibleProducts}
              favoriteProductIds={favoriteProductIds}
              onToggleFavorite={handleToggleFavorite}
              onOpenProductDetail={onOpenProductDetail}
              emptyMessage={
                normalizedSearchQuery
                  ? "검색 결과가 없습니다."
                  : "표시할 상품이 없습니다."
              }
            />
          </section>
        </section>
        <GroupBuyBottomNav
          onOpenMap={onOpenMap}
          onOpenCommunity={onOpenCommunity}
          onOpenGroupbuy={onOpenGroupbuy}
          onOpenMyPage={onOpenMyPage}
        />
      </section>
    </main>
  );
}
