import { useRef, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import backIcon from "../assets/Community_posting/Back icon.png";
import imageAddIcon from "../assets/Community_posting/image-add.png";
import addressIcon from "../assets/Community_posting/Button_Address.png";
import editIcon from "../assets/Community_posting/edit-contained.png";
import chevronDownIcon from "../assets/Community_posting/chevron-down.png";
import BottomNavigation from "./BottomNavigation.jsx";

const categories = ["이용후기", "할인정보", "제보하기"];
const MAX_PHOTO_DATA_URL_LENGTH = 900_000;
const MAX_PHOTO_SIDE = 960;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("사진을 읽지 못했어요."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("사진을 불러오지 못했어요."));
    image.src = dataUrl;
  });
}

function dataUrlLength(dataUrl) {
  return typeof dataUrl === "string" ? dataUrl.length : 0;
}

async function normalizePhotoDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) throw new Error("사진 크기를 확인하지 못했어요.");

  const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.78;
  let nextDataUrl = canvas.toDataURL("image/jpeg", quality);

  while (dataUrlLength(nextDataUrl) > MAX_PHOTO_DATA_URL_LENGTH && quality > 0.5) {
    quality -= 0.08;
    nextDataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrlLength(nextDataUrl) > MAX_PHOTO_DATA_URL_LENGTH) {
    throw new Error("사진 용량이 너무 커요. 더 작은 사진으로 다시 선택해주세요.");
  }

  return nextDataUrl;
}

export default function CommunityPosting({
  onBack,
  onSubmit,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
}) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const photoInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextCategory = category.trim();
    const nextTitle = title.trim();
    const nextBody = body.trim();

    if (!nextCategory || !nextTitle || !nextBody) return;

    if (photoUrl && dataUrlLength(photoUrl) > MAX_PHOTO_DATA_URL_LENGTH) {
      window.alert("사진 용량이 너무 커요. 900KB 이하 사진으로 다시 선택해주세요.");
      return;
    }

    onSubmit?.({
      category: nextCategory,
      title: nextTitle,
      body: nextBody,
      photoUrl,
      location,
    });
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation || isLocating) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "현재 위치",
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        window.alert("위치 권한을 허용하면 현재 위치를 추가할 수 있어요.");
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 8000 },
    );
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("이미지 파일만 추가할 수 있어요.");
      return;
    }

    setIsPhotoProcessing(true);

    try {
      setPhotoUrl(await normalizePhotoDataUrl(file));
    } catch (error) {
      console.error("커뮤니티 사진 처리 실패", error);
      window.alert(error.message || "사진을 추가하지 못했어요. 다른 사진으로 다시 시도해주세요.");
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const handleRemovePhoto = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPhotoUrl("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  return (
    <main className="page-shell">
      <section className="posting-frame" aria-label="글쓰기">
        <header className="posting-header">
          <button
            id="btn-community_posting-header-back"
            className="posting-icon-button posting-back-button"
            type="button"
            data-event="click_back"
            data-page="community_posting"
            data-section="header"
            data-action="back"
            data-label="back"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <img src={backIcon} alt="" />
          </button>
          <h1>글쓰기</h1>
        </header>

        <form className="posting-form" onSubmit={handleSubmit}>
          <div className="posting-category-wrap">
            <button
              id="btn-community_posting-category-toggle"
              className="posting-category-row"
              type="button"
              data-event="click_category_toggle"
              data-page="community_posting"
              data-section="category"
              data-action="toggle_category"
              data-label={category || "empty"}
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              aria-expanded={isCategoryOpen}
            >
              <span
                className={
                  category
                    ? "posting-category-value"
                    : "posting-category-value placeholder"
                }
              >
                {category || "주제를 선택해주세요."}
              </span>
              <img src={chevronDownIcon} alt="" aria-hidden="true" />
            </button>

            {isCategoryOpen && (
              <div className="posting-category-menu">
                {categories.map((item) => (
                  <button
                    id={`btn-community_posting-category-${getCategoryTrackingLabel(item)}`}
                    key={item}
                    className="posting-category-option"
                    type="button"
                    data-event="click_category"
                    data-page="community_posting"
                    data-section="category"
                    data-action="select_category"
                    data-label={getCategoryTrackingLabel(item)}
                    onClick={() => {
                      setCategory(item);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="sr-only" htmlFor="posting-title">
            제목
          </label>
          <input
            id="posting-title"
            className="posting-title-input"
            type="text"
            placeholder="제목을 작성해주세요."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="posting-body">
            내용
          </label>
          <textarea
            id="posting-body"
            className={
              photoUrl ? "posting-body-input has-photo" : "posting-body-input"
            }
            placeholder="어떤 이야기를 공유하고 싶으신가요?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
          />

          {photoUrl && (
            <div className="posting-photo-preview">
              <img src={photoUrl} alt="선택한 사진 미리보기" />
              <button
                id="btn-community-posting-photo-remove"
                className="posting-photo-remove"
                type="button"
                aria-label="사진 삭제"
                data-event="click_remove_photo"
                data-page="community_posting"
                data-section="photo_preview"
                data-action="remove_photo"
                data-label="remove_photo"
                onClick={handleRemovePhoto}
              >
                ×
              </button>
            </div>
          )}

          <div className="posting-bottom-actions">
            <input
              ref={photoInputRef}
              className="posting-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <button
              id="btn-community_posting-photo-add"
              className="posting-secondary-button"
              type="button"
              data-event="click_add_photo"
              data-page="community_posting"
              data-section="bottom_actions"
              data-action="add_photo"
              data-label="photo"
              onClick={() => photoInputRef.current?.click()}
            >
              <img src={imageAddIcon} alt="" />
              사진
            </button>
            <button
              id="btn-community_posting-location-add"
              className={location ? "posting-secondary-button active" : "posting-secondary-button"}
              type="button"
              data-event="click_add_location"
              data-page="community_posting"
              data-section="bottom_actions"
              data-action="add_location"
              data-label={location ? "added" : "location"}
              onClick={handleLocationClick}
              disabled={isLocating}
            >
              <img src={addressIcon} alt="" />
              {isLocating ? "확인중" : location ? "추가됨" : "위치"}
            </button>
            <button id="btn-community_posting-submit" className="posting-submit-button" type="submit" data-event="click_publish_post" data-page="community_posting" data-section="bottom_actions" data-action="publish_post" data-label="post" disabled={isPhotoProcessing}>
              <img src={editIcon} alt="" />
              {isPhotoProcessing ? "처리중" : "게시"}
            </button>
          </div>

          {location && (
            <div className="posting-location-preview">
              <img src={figmaAssets.pdpAddress} alt="" />
              <span>{location.label} 추가됨</span>
            </div>
          )}
        </form>

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

function getCategoryTrackingLabel(value) {
  const categoryMap = {
    이용후기: "review",
    할인정보: "sale",
    제보하기: "report",
  };

  return categoryMap[value] || "category";
}
