import React, { useEffect, useRef, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createPlaceRequest } from "../lib/database.js";

const informCategories = ["식당", "주점", "카페", "문화생활", "미용", "세탁/목욕", "기타"];

export default function InformNewPlacePage({
  onBack,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  onOpenAuth,
}) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("식당");
  const [menuRows, setMenuRows] = useState([{ id: 1 }]);
  const [photos, setPhotos] = useState([]);
  const photoInputRef = useRef(null);
  const photosRef = useRef([]);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1400);
  };

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  const addMenuRow = () => {
    setMenuRows((rows) => {
      if (rows.length >= 4) {
        showToast("메뉴는 최대 4개까지 등록할 수 있어요");
        return rows;
      }
      return [...rows, { id: rows.length + 1 }];
    });
  };

  const addPhoto = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    setPhotos((current) => {
      const available = Math.max(0, 6 - current.length);
      const nextFiles = selectedFiles.slice(0, available).map((file) => ({
        id: file.name + '-' + file.lastModified + '-' + file.size,
        file,
        url: URL.createObjectURL(file)
      }));

      if (selectedFiles.length > available) showToast("사진은 최대 6장까지 등록할 수 있어요");
      return [...current, ...nextFiles];
    });

    event.target.value = "";
  };

  const removePhoto = (photoId) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === photoId);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== photoId);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      showToast("로그인이 필요해요");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const placeName = String(formData.get("place_name") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const menus = menuRows
      .map((row) => ({
        name: String(formData.get(`menu_${row.id}`) || "").trim(),
        price: String(formData.get(`price_${row.id}`) || "").trim()
      }))
      .filter((menu) => menu.name || menu.price);

    if (!placeName) {
      showToast("업소 이름을 입력해주세요");
      return;
    }

    try {
      await createPlaceRequest({
        userId: user.id,
        category: selectedCategory,
        placeName,
        address,
        menus,
        photoCount: photos.length
      });
      showToast("등록 신청이 접수되었어요");
    } catch (error) {
      console.error("장소 등록 신청 실패", error);
      showToast("등록 신청에 실패했어요");
    }
  };

  return (
    <section className="phone-page inform-page">
      <header className="inform-header">
        <div className="inform-title-row">
          <button id="btn-inform-header-back" type="button" className="inform-back" data-event="click_back" data-page="inform" data-section="header" data-action="back" data-label="back" onClick={onBack} aria-label="뒤로가기">
            <img src={figmaAssets.informBack} alt="" />
          </button>
          <h1>제보하기</h1>
        </div>
        <div className="inform-header-icons">
          <button id="btn-inform-header-login_social" type="button" aria-label="회원가입" data-event="click_login" data-page="inform" data-section="header" data-action="login_social" data-label="social_login" onClick={() => onOpenAuth?.("login")}><img src={figmaAssets.signUpIcon} alt="" /></button>
          <button id="btn-inform-header-login_email" type="button" aria-label="로그인" data-event="click_login" data-page="inform" data-section="header" data-action="login_email" data-label="email_login" onClick={() => onOpenAuth?.("id-login")}><img src={figmaAssets.loginIcon} alt="" /></button>
        </div>
      </header>

      <form id="inform-place-request-form" className="inform-body" onSubmit={handleSubmit}>
        <section className="inform-field">
          <h2>어떤 곳인가요?</h2>
          <div className="inform-category-row" aria-label="업소 카테고리">
            {informCategories.map((category) => (
              <button
                id={`btn-inform-category-${getInformCategoryTrackingLabel(category)}`}
                key={category}
                type="button"
                className={selectedCategory === category ? "active" : ""}
                data-event="click_category"
                data-page="inform"
                data-section="category"
                data-action="select_category"
                data-label={getInformCategoryTrackingLabel(category)}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="inform-field">
          <h2>이름을 알려주세요.</h2>
          <input name="place_name" aria-label="업소 이름" placeholder="예) 기특한 냉면" />
        </section>

        <section className="inform-field">
          <h2>어디에 있어요?</h2>
          <label className="inform-address-input">
            <input name="address" aria-label="주소" placeholder="주소를 검색하세요" />
            <img src={figmaAssets.informSearch} alt="" />
          </label>
        </section>

        <section className="inform-field">
          <h2>대표 메뉴와 가격을 등록해주세요.</h2>
          <div className="inform-menu-list">
            {menuRows.map((row) => (
              <div className="inform-menu-row" key={row.id}>
                <input name={`menu_${row.id}`} aria-label={`메뉴 ${row.id}`} placeholder="메뉴" />
                <input name={`price_${row.id}`} aria-label={`가격 ${row.id}`} placeholder="가격" inputMode="numeric" />
              </div>
            ))}
          </div>
          <button id="btn-inform-menu-add" type="button" className="inform-add-menu" data-event="click_add_menu" data-page="inform" data-section="menu" data-action="add_menu" data-label="menu" onClick={addMenuRow}>
            <img src={figmaAssets.informPlus} alt="" />
            메뉴 추가 ({menuRows.length - 1}/4)
          </button>
        </section>

        <section className="inform-field">
          <h2>업체를 확인할 수 있는 사진을 등록해주세요.</h2>
          <div className="inform-photo-list">
            <button id="btn-inform-photo-add" type="button" className="inform-photo-button" data-event="click_add_photo" data-page="inform" data-section="photo" data-action="add_photo" data-label="photo" onClick={addPhoto}>
              <img src={figmaAssets.informImageAdd} alt="" />
              <span>( {photos.length} / 6 )</span>
            </button>
            {photos.map((photo) => (
              <button
                id={`btn-inform-photo-remove_${photo.id}`}
                key={photo.id}
                type="button"
                className="inform-photo-preview"
                data-event="click_remove_photo"
                data-page="inform"
                data-section="photo"
                data-action="remove_photo"
                data-label={String(photo.id)}
                onClick={() => removePhoto(photo.id)}
                aria-label="등록한 사진 삭제"
              >
                <img src={photo.url} alt="등록한 업체 사진" />
              </button>
            ))}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="inform-photo-input"
            onChange={handlePhotoChange}
          />
        </section>
      </form>

      <div className="inform-submit-bar">
        <button id="btn-inform-submit" type="submit" form="inform-place-request-form" data-event="click_submit_inform" data-page="inform" data-section="submit_bar" data-action="submit_inform" data-label="inform">등록 신청</button>
      </div>

      <nav className="figma-bottom-nav">
        <button id="btn-inform-bottom_nav-map" type="button" className="active" data-event="click_nav_map" data-page="inform" data-section="bottom_nav" data-action="nav_map" data-label="map" onClick={onOpenMap}>
          <img src={figmaAssets.informNavMap} alt="" />
          <span>지도</span>
        </button>
        <button id="btn-inform-bottom_nav-community" type="button" data-event="click_nav_community" data-page="inform" data-section="bottom_nav" data-action="nav_community" data-label="community" onClick={onOpenCommunity}>
          <img src={figmaAssets.informNavCommunity} alt="" />
          <span>커뮤니티</span>
        </button>
        <button id="btn-inform-bottom_nav-groupbuy" type="button" data-event="click_nav_groupbuy" data-page="inform" data-section="bottom_nav" data-action="nav_groupbuy" data-label="groupbuy" onClick={onOpenGroupbuy}>
          <img src={figmaAssets.informNavBuy} alt="" />
          <span>공동구매</span>
        </button>
        <button id="btn-inform-bottom_nav-mypage" type="button" data-event="click_nav_mypage" data-page="inform" data-section="bottom_nav" data-action="nav_mypage" data-label="mypage" onClick={onOpenMyPage}>
          <img src={figmaAssets.informNavMy} alt="" />
          <span>마이페이지</span>
        </button>
      </nav>

      {toast && <div className="inform-toast">{toast}</div>}
    </section>
  );
}

function getInformCategoryTrackingLabel(value) {
  const categoryMap = {
    식당: "restaurant",
    카페: "cafe",
    주점: "bar",
    문화생활: "culture",
    미용: "beauty",
    "세탁&목욕": "laundry",
    기타: "etc",
  };

  return categoryMap[value] || "etc";
}
