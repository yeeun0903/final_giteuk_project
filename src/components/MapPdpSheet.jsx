import React, { useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import { formatWon, getMapLink, placeImagePlaceholder } from "../utils/placeData.js";

function toTrackingSlug(value) {
  return String(value || "place")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "place";
}

export default function MapPdpSheet({
  place,
  onClose,
  onOpenInform,
  onConfirmVisited,
  isAuthenticated = false,
  onRequireAuth,
  isLiked = false,
  onToggleLike,
}) {
  const [toast, setToast] = useState("");
  const [visitedPopupOpen, setVisitedPopupOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const CATEGORY_Q3_PRICE = {
    문화생활: 0,
    "세탁&목욕": 8000,
    카페: 3000,
    주점: 18000,
    식당: 10000,
    미용: 25000,
    기타: 90000
  };

  const basePrice = CATEGORY_Q3_PRICE[place.category] ?? 0;
  const placePrice = place.price1 || 0;
  const saving = basePrice - placePrice;
  const visibleSaving = Math.max(0, saving);
  const galleryImages = place.images?.length ? place.images : [placeImagePlaceholder];
  const mapLink = getMapLink(place);
  const description = place.description || place.category;
  const canExpandDescription = description.length > 22;
  const isCulturePlace = String(place.category || "").includes("문화");
  const menuSectionTitle = isCulturePlace ? "기특 가격" : "기특 메뉴";
  const primaryMenuLabel = isCulturePlace ? "입장료" : place.menu1 || "대표 메뉴";
  const primaryPriceText = isCulturePlace ? "0원" : place.price1Text || formatWon(place.price1);
  const trackingPlaceId = toTrackingSlug(place.id || place.place_id || place.place_name);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1500);
  };

  const handleShare = async () => {
    const shareText = `${place.place_name} - ${place.description || place.address}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: place.place_name,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
    showToast("링크를 복사했어요");
  };

  return (
    <section className="map-pdp-sheet" aria-label="업소 상세">
      <button id={`btn-detail-sheet-close_${trackingPlaceId}`} className="pdp-close-button" data-event="click_close" data-page="detail" data-section="sheet" data-action="close" data-label={trackingPlaceId} onClick={onClose} aria-label="상세 닫기">×</button>
      <div className="pdp-handle" />
      <div className="pdp-gallery" aria-label={`${place.place_name} 이미지`}>
        {galleryImages.map((imageUrl, index) => (
          <img
            key={`${imageUrl}-${index}`}
            src={imageUrl}
            alt={`${place.place_name} 이미지 ${index + 1}`}
            onError={(event) => {
              event.currentTarget.src = placeImagePlaceholder;
            }}
          />
        ))}
      </div>

      <div className={descriptionOpen ? "pdp-title-row expanded" : "pdp-title-row"}>
        <div>
          <strong>{place.place_name}</strong>
          <p>{description}</p>
          {canExpandDescription && (
            <button
              id={`btn-detail-description-toggle_${trackingPlaceId}`}
              type="button"
              className="pdp-description-toggle"
              data-event="click_description_toggle"
              data-page="detail"
              data-section="description"
              data-action="toggle_description"
              data-label={trackingPlaceId}
              onClick={() => setDescriptionOpen((value) => !value)}
            >
              {descriptionOpen ? "접기" : "더보기"}
            </button>
          )}
        </div>
        <button id={`btn-detail-title-close_${trackingPlaceId}`} data-event="click_close" data-page="detail" data-section="title" data-action="close" data-label={trackingPlaceId} onClick={onClose} aria-label="닫기">닫기</button>
      </div>

      {saving > 0 && (
        <div className="pdp-benefit">
          <img src={figmaAssets.pdpSaving} alt="" />
          <b><span>일반 {place.category}보다</span><em>{formatWon(saving)}</em><span>더 착해요!</span></b>
        </div>
      )}

      <div className="pdp-quick-actions">
        <button
          id={`btn-detail-quick-favorite_${trackingPlaceId}`}
          className={isLiked ? "active" : ""}
          data-event="click_favorite"
          data-page="detail"
          data-section="quick_actions"
          data-action={isLiked ? "unfavorite" : "favorite"}
          data-label={trackingPlaceId}
          onClick={() => {
            onToggleLike?.(place);
            showToast(isLiked ? "찜을 해제했어요" : "찜했어요");
          }}
        >
          <img src={figmaAssets.pdpHeart} alt="" />찜하기
        </button>
        <button id={`btn-detail-quick-share_${trackingPlaceId}`} data-event="click_share" data-page="detail" data-section="quick_actions" data-action="share" data-label={trackingPlaceId} onClick={handleShare}><img src={figmaAssets.pdpShare} alt="" />공유하기</button>
        <a id={`btn-detail-quick-route_${trackingPlaceId}`} data-event="click_route" data-page="detail" data-section="quick_actions" data-action="route" data-label={trackingPlaceId} href={mapLink} target="_blank" rel="noreferrer"><img src={figmaAssets.pdpMap} alt="" />길찾기</a>
      </div>

      <dl className="pdp-info">
        <div>
          <dt><img src={figmaAssets.pdpAddress} alt="" /></dt>
          <dd>{place.address || "주소 정보 없음"}</dd>
        </div>
        <div>
          <dt><img src={figmaAssets.pdpPhone} alt="" /></dt>
          <dd>{place.phone || "전화번호 없음"}</dd>
        </div>
      </dl>

      <div className="pdp-menu">
        <h3>{menuSectionTitle}</h3>
        <ul>
          <li>
            <span>{primaryMenuLabel}</span>
            <b>{primaryPriceText}</b>
          </li>
          {!isCulturePlace && place.menu2 && (
            <li>
              <span>{place.menu2}</span>
              <b>{place.price2Text || formatWon(place.price2)}</b>
            </li>
          )}
        </ul>
      </div>

      <div className="pdp-actions">
        <button
          id={`btn-detail-actions-visit_complete_${trackingPlaceId}`}
          type="button"
          data-event="click_visit_complete"
          data-page="detail"
          data-section="actions"
          data-action="visit_complete"
          data-label={trackingPlaceId}
          onClick={() => {
            if (!isAuthenticated) {
              onRequireAuth?.();
              return;
            }
            setVisitedPopupOpen(true);
          }}
        >
          <span>얼마나 아꼈는지 기록해볼까요?</span>
          <b><img src={figmaAssets.pdpVisited} alt="" />방문완료</b>
        </button>
        <button id={`btn-detail-actions-report_${trackingPlaceId}`} type="button" data-event="click_report" data-page="detail" data-section="actions" data-action="report" data-label={trackingPlaceId} onClick={onOpenInform}>
          <span>매장 정보가 달라졌나요?</span>
          <b><img src={figmaAssets.pdpInform} alt="" />제보하기</b>
        </button>
      </div>

      {visitedPopupOpen && (
        <div className="visited-popup-backdrop" role="presentation" onClick={() => setVisitedPopupOpen(false)}>
          <section
            className="visited-place-popup"
            role="dialog"
            aria-modal="true"
            aria-label="방문완료 절약 금액"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              id={`btn-detail-visit_popup-close_${trackingPlaceId}`}
              type="button"
              className="visited-popup-close"
              aria-label="팝업 닫기"
              data-event="click_close"
              data-page="detail"
              data-section="visit_popup"
              data-action="close"
              data-label={trackingPlaceId}
              onClick={() => setVisitedPopupOpen(false)}
            >
              <img src={figmaAssets.mapPopupClose} alt="" />
            </button>

            <div className="visited-popup-copy">
              <p>오늘도 기특한 선택!</p>
              {visibleSaving > 0 ? (
                <div className="visited-popup-main">
                  <span className="visited-popup-price">{visibleSaving.toLocaleString("ko-KR")}</span>
                  <span className="visited-popup-won">원</span>
                  <span className="visited-popup-success">절약 성공</span>
                </div>
              ) : (
                <div className="visited-popup-main only-success">
                  <span className="visited-popup-success">절약 성공</span>
                </div>
              )}
            </div>

            <img
              className="visited-popup-character"
              src={figmaAssets.mapPopupGoodCharacter}
              alt="기특이 캐릭터"
            />

            <button
              id={`btn-detail-visit_popup-confirm_${trackingPlaceId}`}
              type="button"
              className="visited-popup-cta"
              data-event="click_visit_confirm"
              data-page="detail"
              data-section="visit_popup"
              data-action="confirm_visit"
              data-label={trackingPlaceId}
              onClick={() => {
                setVisitedPopupOpen(false);
                onConfirmVisited?.({ savingAmount: visibleSaving, place });
              }}
            >
              누적 금액 확인
            </button>
          </section>
        </div>
      )}

      {toast && <div className="pdp-toast">{toast}</div>}
    </section>
  );
}
