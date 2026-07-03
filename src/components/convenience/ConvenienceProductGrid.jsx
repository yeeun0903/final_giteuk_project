import ConvenienceProductCard from "./ConvenienceProductCard.jsx";

export default function ConvenienceProductGrid({ products, loading, error }) {
  if (loading) {
    return <p className="convenience-status">상품을 불러오는 중이에요.</p>;
  }

  if (error) {
    return <p className="convenience-status">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="convenience-status">조건에 맞는 상품이 없어요.</p>;
  }

  return (
    <section className="convenience-product-grid" aria-label="행사 상품 목록">
      {products.map((product) => (
        <ConvenienceProductCard
          key={`${product.brand_name}-${product.product_name}-${product.event_type}`}
          product={product}
        />
      ))}
    </section>
  );
}
