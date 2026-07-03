import usersCheckIcon from "../../assets/GroupBuy_Main/users-check.png";
import ratingIcon from "../../assets/GroupBuy_Main/Button_Rating.png";
import heartIcon from "../../assets/GroupBuy_Main/heart.png";
import activeHeartIcon from "../../assets/GroupBuy_Main/heart2.png";

function toTrackingSlug(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "item";
}

export default function GroupBuyProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenProductDetail,
}) {
  const isClickable = Boolean(onOpenProductDetail);
  const trackingId = toTrackingSlug(product.id);

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <article
      className={
        isClickable
          ? "groupbuy-product-card groupbuy-product-card-clickable"
          : "groupbuy-product-card"
      }
    >
      {isClickable && (
        <button
          id={`btn-groupbuy-product_card-open_${trackingId}`}
          className="groupbuy-product-open-button"
          type="button"
          aria-label={`${product.title} 상세 보기`}
          data-event="click_groupbuy_product"
          data-page="groupbuy"
          data-section="product_card"
          data-action="open_detail"
          data-label={trackingId}
          onClick={() => onOpenProductDetail(product)}
        />
      )}
      <img className="groupbuy-product-image" src={product.image} alt={product.title} />
      <div className="groupbuy-product-content">
        <div className="groupbuy-product-main">
          <h3>{product.title}</h3>
          <div className="groupbuy-product-pricing">
            <div className="groupbuy-original-price">
              <span>정가</span>
              <span>{product.originalPrice}</span>
            </div>
            <div className="groupbuy-sale-price">
              <span>공구가</span>
              <strong>{product.groupPrice}</strong>
              <em>{product.discount}</em>
            </div>
          </div>
        </div>
        <div className="groupbuy-product-meta">
          <div className="groupbuy-participants">
            <img src={usersCheckIcon} alt="" />
            <span><strong>{product.participants}</strong>이 함께하고 있어요</span>
          </div>
          <div className="groupbuy-rating">
            <img src={ratingIcon} alt="" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
      <button
        id={`btn-groupbuy-product_card-favorite_${trackingId}`}
        className="groupbuy-heart-button"
        type="button"
        aria-label={isFavorite ? `${product.title} 찜 해제` : `${product.title} 찜하기`}
        aria-pressed={isFavorite}
        data-event="click_groupbuy_favorite"
        data-page="groupbuy"
        data-section="product_card"
        data-action={isFavorite ? "unfavorite" : "favorite"}
        data-label={trackingId}
        onClick={handleFavoriteClick}
      >
        <img src={isFavorite ? activeHeartIcon : heartIcon} alt="" />
      </button>
    </article>
  );
}
