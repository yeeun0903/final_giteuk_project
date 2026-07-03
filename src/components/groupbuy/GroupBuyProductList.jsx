import GroupBuyProductCard from "./GroupBuyProductCard.jsx";

const detailProductIds = [
  "detergent",
  "sun-bb",
  "ice-cream",
  "glasses",
  "tissue",
  "nike",
  "rice",
  "kanu",
  "shampoo",
];

export default function GroupBuyProductList({
  products,
  favoriteProductIds,
  onToggleFavorite,
  onOpenProductDetail,
  emptyMessage,
}) {
  if (products.length === 0) {
    return <p className="groupbuy-empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="groupbuy-product-list">
      {products.map((product) => (
        <GroupBuyProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteProductIds.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          onOpenProductDetail={
            detailProductIds.includes(product.id)
              ? onOpenProductDetail
              : undefined
          }
        />
      ))}
    </div>
  );
}
