import { groupbuyPopularProducts } from "../../data/groupbuyMainData.js";

const popularDetailProductIds = {
  "best-detergent": "detergent",
  "best-tissue": "tissue",
  "best-rice": "rice",
};

export default function GroupBuyPopularSection({ onOpenProductDetail }) {
  return (
    <section className="groupbuy-popular-section" aria-label="인기상품">
      <h2>🔥 인기상품</h2>
      <div className="groupbuy-popular-list">
        {groupbuyPopularProducts.map((product) => {
          const detailProductId = popularDetailProductIds[product.id];
          const isClickable = Boolean(detailProductId);

          return (
            <article
              className={
                isClickable
                  ? "groupbuy-best-card groupbuy-best-card-clickable"
                  : "groupbuy-best-card"
              }
              key={product.id}
            >
              {isClickable && (
                <button
                  className="groupbuy-best-card-open-button"
                  type="button"
                  aria-label={`${product.name} 상세 보기`}
                  onClick={() => onOpenProductDetail({ id: detailProductId })}
                />
              )}
              <img
                className="groupbuy-best-image"
                src={product.image}
                alt={product.name}
              />
              <div className="groupbuy-best-info">
                <div className="groupbuy-best-name">{product.name}</div>
                <dl className="groupbuy-best-price-list">
                  <div>
                    <dt>정가</dt>
                    <dd>{product.originalPrice}</dd>
                  </div>
                  <div>
                    <dt>공구가</dt>
                    <dd className="groupbuy-price-chip">
                      {product.groupPrice}
                    </dd>
                  </div>
                  <div>
                    <dt>할인율</dt>
                    <dd className="groupbuy-price-chip">
                      {product.discount}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
