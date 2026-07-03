import { useState } from "react";
import detailImage from "../assets/GroupBuy_Product_detail/햇반.png";
import backIcon from "../assets/GroupBuy_Product_detail/Back icon.png";
import ratingIcon from "../assets/GroupBuy_Product_detail/Button_Rating.png";
import shareIcon from "../assets/GroupBuy_Product_detail/Button_Share.png";
import detailHeartIcon from "../assets/GroupBuy_Product_detail/heart.png";
import activeHeartIcon from "../assets/GroupBuy_Main/heart2.png";
import saleIcon from "../assets/GroupBuy_Product_detail/sale-02.png";
import { groupbuyProducts } from "../data/groupbuyMainData.js";
import {
  isFavoriteProduct,
  toggleFavoriteProduct,
} from "../utils/groupbuyFavorites.js";

const product = groupbuyProducts.find((item) => item.id === "rice");

const productInfoRows = [
  ["브랜드", "햇반"],
  ["구성", "210g 3개입 6+6개"],
  ["카테고리", "식품"],
  ["배송비", "무료배송"],
  ["배송 예정일", "결제 후 2~3일 이내"],
  ["반품/교환", "수령 후 7일 이내"],
];

export default function GroupBuyProductDetail07({ onBack }) {
  const [isFavorite, setIsFavorite] = useState(() =>
    isFavoriteProduct(product.id),
  );

  const handleToggleFavorite = () => {
    const nextFavoriteIds = toggleFavoriteProduct(product.id);
    setIsFavorite(nextFavoriteIds.includes(product.id));
  };

  return (
    <main className="groupbuy-page-shell">
      <section className="groupbuy-detail-frame" aria-label="상품 상세">
        <header className="groupbuy-detail-header">
          <button
            id="btn-groupbuy_detail_07-header-back"
            className="groupbuy-detail-back-button"
            type="button"
            aria-label="뒤로가기"
            data-event="click_back"
            data-page="groupbuy_detail_07"
            data-section="header"
            data-action="back"
            data-label="product_07"
            onClick={onBack}
          >
            <img src={backIcon} alt="" aria-hidden="true" />
          </button>
          <h1>상품 상세</h1>
          <button
            id="btn-groupbuy_detail_07-header-favorite"
            className="groupbuy-detail-header-heart"
            type="button"
            aria-label={isFavorite ? "찜 해제" : "찜하기"}
            aria-pressed={isFavorite}
            data-event="click_groupbuy_favorite"
            data-page="groupbuy_detail_07"
            data-section="header"
            data-action={isFavorite ? "unfavorite" : "favorite"}
            data-label="product_07"
            onClick={handleToggleFavorite}
          >
            <img src={isFavorite ? activeHeartIcon : detailHeartIcon} alt="" />
          </button>
        </header>

        <section className="groupbuy-detail-content">
          <div className="groupbuy-detail-hero">
            <img
              className="groupbuy-detail-hero-image-original"
              src={detailImage}
              alt="윤기가득햇반 210g 3개입 6+6개 (총 36개)"
            />
          </div>

          <section className="groupbuy-detail-summary" aria-label="상품 요약">
            <div className="groupbuy-detail-category-row">
              <span className="groupbuy-detail-category">식품</span>
              <span className="groupbuy-detail-rating">
                <img src={ratingIcon} alt="" />
                {product.rating} (1341)
              </span>
            </div>

            <h2 className="groupbuy-detail-title-wrap">
              윤기가득햇반 210g 3개입 6+6개 (총 36개)
            </h2>
            <p>든든하게 준비하는 간편한 즉석밥 대용량 구성</p>

            <div className="groupbuy-detail-price-block">
              <div className="groupbuy-detail-original-price">
                <span>정가</span>
                <del>{product.originalPrice}원</del>
              </div>
              <div className="groupbuy-detail-sale-row">
                <span>공구가</span>
                <strong>{product.groupPrice}</strong>
                <em>{product.discount}</em>
              </div>
            </div>

            <div className="groupbuy-detail-progress">
              <div className="groupbuy-detail-progress-meta">
                <strong>{product.participants} 참여 중</strong>
                <span>목표 10,000명</span>
              </div>
              <div className="groupbuy-detail-progress-row">
                <div className="groupbuy-detail-progress-bar">
                  <span className="groupbuy-detail-progress-bar-rice" />
                </div>
                <b>79%</b>
              </div>
            </div>
          </section>

          <div className="groupbuy-detail-divider" />

          <section className="groupbuy-detail-participation">
            <h3>참여 현황</h3>
            <div
              className="groupbuy-detail-stat-card"
              aria-label="공동구매 참여 현황"
            >
              <div>
                <span>현재 참여자</span>
                <strong>{product.participants}</strong>
              </div>
              <div>
                <span>남은 시간</span>
                <strong>2일 19:05</strong>
              </div>
            </div>
          </section>

          <section className="groupbuy-detail-info">
            <h3>상품 정보</h3>
            <div className="groupbuy-detail-table" aria-label="상품 정보">
              {productInfoRows.map(([label, value]) => (
                <div className="groupbuy-detail-table-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </section>

        <div className="groupbuy-detail-action-bar">
          <button id="btn-groupbuy_detail_07-bottom-share" className="groupbuy-detail-share-button" type="button" data-event="click_share" data-page="groupbuy_detail_07" data-section="bottom_actions" data-action="share" data-label="product_07">
            <img
              className="groupbuy-detail-share-icon"
              src={shareIcon}
              alt=""
              aria-hidden="true"
            />
            공유하기
          </button>
          <button id="btn-groupbuy_detail_07-bottom-participate" className="groupbuy-detail-buy-button" type="button" data-event="click_participate" data-page="groupbuy_detail_07" data-section="bottom_actions" data-action="participate" data-label="product_07">
            <img
              className="groupbuy-detail-sale-icon"
              src={saleIcon}
              alt=""
              aria-hidden="true"
            />
            참여하기
          </button>
        </div>
      </section>
    </main>
  );
}
