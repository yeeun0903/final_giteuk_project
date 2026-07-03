import React, { useMemo, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import { formatWon } from "../utils/placeData.js";

function HeaderAction({ src, label, action, onClick }) {
  return (
    <button id={`btn-mypage-header-${action}`} type="button" aria-label={label} data-event="click_login" data-page="mypage" data-section="header" data-action={action} data-label={action} onClick={onClick}>
      <img src={src} alt="" />
    </button>
  );
}

function MyListRow({ icon, title, copy, action = "open_detail", onClick }) {
  return (
    <button id={`btn-mypage-list-${action}`} type="button" className="mypage-list-row" data-event={`click_${action}`} data-page="mypage" data-section="list" data-action={action} data-label={action} onClick={onClick}>
      <span className="mypage-list-icon"><img src={icon} alt="" /></span>
      <span>
        <strong>{title}</strong>
        <small>{copy}</small>
      </span>
      <img className="row-chevron" src={figmaAssets.myChevron} alt="" />
    </button>
  );
}

function MyPageNav({ onOpenMap, onOpenCommunity, onOpenGroupbuy }) {
  return (
    <nav className="figma-bottom-nav mypage-bottom-nav">
      <button id="btn-mypage-bottom_nav-map" type="button" data-event="click_nav_map" data-page="mypage" data-section="bottom_nav" data-action="nav_map" data-label="map" onClick={onOpenMap}>
        <img src={figmaAssets.myNavMap} alt="" />
        <span>지도</span>
      </button>
      <button id="btn-mypage-bottom_nav-community" type="button" data-event="click_nav_community" data-page="mypage" data-section="bottom_nav" data-action="nav_community" data-label="community" onClick={onOpenCommunity}>
        <img src={figmaAssets.myNavCommunity} alt="" />
        <span>커뮤니티</span>
      </button>
      <button id="btn-mypage-bottom_nav-groupbuy" type="button" data-event="click_nav_groupbuy" data-page="mypage" data-section="bottom_nav" data-action="nav_groupbuy" data-label="groupbuy" onClick={onOpenGroupbuy}>
        <img src={figmaAssets.myNavBuy} alt="" />
        <span>공동구매</span>
      </button>
      <button id="btn-mypage-bottom_nav-mypage" type="button" className="active" data-event="click_nav_mypage" data-page="mypage" data-section="bottom_nav" data-action="nav_mypage" data-label="mypage">
        <img src={figmaAssets.myNavMy} alt="" />
        <span>마이페이지</span>
      </button>
    </nav>
  );
}

function DetailHeader({ title, onBack }) {
  return (
    <header className="mypage-detail-header">
      <button id="btn-mypage-detail-back" type="button" data-event="click_back" data-page="mypage" data-section="detail_header" data-action="back" data-label="back" onClick={onBack} aria-label="뒤로가기">
        <img src={figmaAssets.customerBack} alt="" />
      </button>
      <h1>{title}</h1>
    </header>
  );
}

function EmptyDetail({ icon, title, copy }) {
  return (
    <section className="mypage-detail-empty-card">
      <span className="mypage-list-icon"><img src={icon} alt="" /></span>
      <strong>{title}</strong>
      <p>{copy}</p>
    </section>
  );
}

function formatVisitDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "오늘";
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function SavingsDetail({ records, monthlySaving, onBack, navigationProps }) {
  return (
    <section className="phone-page my-page figma-mypage mypage-detail-page mypage-inner-page savings-page">
      <DetailHeader title="이번 달 절약" onBack={onBack} />

      <section className="mypage-detail-summary-card saving-detail-summary">
        <span className="mypage-list-icon"><img src={figmaAssets.mySaving} alt="" /></span>
        <div>
          <small>방문완료로 모은 이번 달 절약</small>
          <strong>{formatWon(monthlySaving)}</strong>
        </div>
      </section>

      {records.length > 0 ? (
        <section className="mypage-visit-list savings-visit-list" aria-label="방문완료 가게 목록">
          {records.map((record) => (
            <article className="mypage-visit-item" key={record.id}>
              <div>
                <strong>{record.place_name}</strong>
                <small>{record.category} · {formatVisitDate(record.visited_at)}</small>
              </div>
              <b>{formatWon(record.saving_amount)}</b>
            </article>
          ))}
        </section>
      ) : (
        <EmptyDetail
          icon={figmaAssets.mySaving}
          title="아직 방문완료한 가게가 없어요"
          copy="가게 상세에서 방문완료를 누르면 절약 내역이 여기에 모여요."
        />
      )}

      <MyPageNav {...navigationProps} />
    </section>
  );
}

function PurchasesDetail({ records, onBack, navigationProps }) {
  return (
    <section className="phone-page my-page figma-mypage mypage-detail-page mypage-inner-page orders-page">
      <DetailHeader title="이번 달 구매" onBack={onBack} />

      {records.length > 0 ? (
        <section className="mypage-visit-list mypage-like-list" aria-label="이번 달 공동구매 목록">
          {records.map((record) => (
            <article className="mypage-visit-item mypage-groupbuy-like-item" key={record.id}>
              <img className="mypage-groupbuy-like-thumb" src={record.image} alt="" />
              <div>
                <strong>{record.title}</strong>
                <small>{record.category} · {formatVisitDate(record.purchased_at)}</small>
              </div>
              <b>{record.groupPrice}</b>
            </article>
          ))}
        </section>
      ) : (
        <EmptyDetail
          icon={figmaAssets.myBag}
          title="이번 달 참여한 공동구매가 없어요"
          copy="상품 상세에서 참여하기를 누르면 공동구매 내역이 여기에 모여요."
        />
      )}

      <MyPageNav {...navigationProps} />
    </section>
  );
}

function LikeDetail({ places, products, onBack, navigationProps }) {
  const [activeTab, setActiveTab] = useState("places");
  const isPlaceTab = activeTab === "places";
  const emptyTitle = isPlaceTab ? "아직 찜한 스팟이 없어요" : "아직 찜한 공동구매가 없어요";
  const emptyCopy = isPlaceTab
    ? "마음에 드는 가성비 스팟을 찜하면 이곳에서 다시 볼 수 있어요."
    : "공동구매 상품의 하트를 누르면 이곳에서 다시 볼 수 있어요.";

  return (
    <section className="phone-page my-page figma-mypage mypage-detail-page mypage-inner-page likes-page">
      <DetailHeader title="찜 목록" onBack={onBack} />
      <div className="mypage-like-tabs" role="tablist" aria-label="찜 목록 카테고리">
        <button
          type="button"
          className={isPlaceTab ? "active" : ""}
          onClick={() => setActiveTab("places")}
        >
          기특 가게
        </button>
        <button
          type="button"
          className={!isPlaceTab ? "active" : ""}
          onClick={() => setActiveTab("groupbuy")}
        >
          공동구매
        </button>
      </div>

      {isPlaceTab && places.length > 0 ? (
        <section className="mypage-visit-list mypage-like-list" aria-label="찜한 가게 목록">
          {places.map((place) => (
            <article className="mypage-visit-item" key={String(place.place_id || place.id || place.place_name)}>
              <div>
                <strong>{place.place_name}</strong>
                <small>{place.category || "가성비 스팟"}</small>
              </div>
              <b>찜</b>
            </article>
          ))}
        </section>
      ) : !isPlaceTab && products.length > 0 ? (
        <section className="mypage-visit-list mypage-like-list" aria-label="찜한 공동구매 목록">
          {products.map((product) => (
            <article className="mypage-visit-item mypage-groupbuy-like-item" key={product.id}>
              <img className="mypage-groupbuy-like-thumb" src={product.image} alt="" />
              <div>
                <strong>{product.title}</strong>
                <small>{product.category} · 공구가 {product.groupPrice}</small>
              </div>
              <b>찜</b>
            </article>
          ))}
        </section>
      ) : (
        <EmptyDetail
          icon={figmaAssets.myHeart}
          title={emptyTitle}
          copy={emptyCopy}
        />
      )}
      <MyPageNav {...navigationProps} />
    </section>
  );
}

function SettingsToggle({ checked, onChange, label }) {
  return (
    <label className="settings-toggle" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span aria-hidden="true" />
    </label>
  );
}

function SettingsRow({ title, copy, children }) {
  return (
    <div className="settings-row">
      <div>
        <strong>{title}</strong>
        <small>{copy}</small>
      </div>
      {children}
    </div>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <section className="settings-group">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SettingsDetail({ onBack, navigationProps }) {
  const [savingNotice, setSavingNotice] = useState(true);
  const [groupbuyNotice, setGroupbuyNotice] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <section className="phone-page my-page figma-mypage mypage-detail-page mypage-inner-page settings-page">
      <DetailHeader title="설정" onBack={onBack} />

      <section className="settings-profile-card">
        <span className="mypage-list-icon"><img src={figmaAssets.mySettings} alt="" /></span>
        <div>
          <strong>기특기특 설정</strong>
          <p>알림과 서비스 상태를 한눈에 확인해요</p>
        </div>
      </section>

      <div className="settings-content">
        <SettingsGroup title="알림">
          <SettingsRow title="절약 알림" copy="방문완료와 절약 금액 안내">
            <SettingsToggle
              label="절약 알림"
              checked={savingNotice}
              onChange={() => setSavingNotice((value) => !value)}
            />
          </SettingsRow>
          <SettingsRow title="공동구매 알림" copy="새 공동구매와 마감 알림">
            <SettingsToggle
              label="공동구매 알림"
              checked={groupbuyNotice}
              onChange={() => setGroupbuyNotice((value) => !value)}
            />
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup title="서비스">
          <SettingsRow title="위치 기반 추천" copy="근처 가성비 스팟을 먼저 보여줘요">
            <SettingsToggle
              label="위치 기반 추천"
              checked={locationEnabled}
              onChange={() => setLocationEnabled((value) => !value)}
            />
          </SettingsRow>
          <SettingsRow title="앱 버전" copy="현재 설치된 기특기특 버전">
            <span className="settings-value">v1.0.0</span>
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup title="계정">
          <SettingsRow title="로그인 상태" copy="구글, 카카오, 이메일 로그인을 사용할 수 있어요">
            <span className="settings-status">활성화</span>
          </SettingsRow>
          <button type="button" className="settings-logout-button">로그아웃</button>
        </SettingsGroup>
      </div>

      <MyPageNav {...navigationProps} />
    </section>
  );
}

function SimpleDetail({ title, icon, heading, copy, onBack, navigationProps }) {
  return (
    <section className="phone-page my-page figma-mypage mypage-detail-page mypage-inner-page orders-page">
      <DetailHeader title={title} onBack={onBack} />
      <EmptyDetail icon={icon} title={heading} copy={copy} />
      <MyPageNav {...navigationProps} />
    </section>
  );
}

export default function MyPage({
  onOpenCustomize,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenCustomerCenter,
  onOpenAuth,
  isAuthenticated = false,
  nickname = "게스트",
  totalSaving = 0,
  monthlySaving = 0,
  monthlyPurchaseCount = 0,
  visitRecords = [],
  groupbuyPurchaseRecords = [],
  likedPlaces = [],
  likedGroupbuyProducts = [],
}) {
  const [view, setView] = useState("home");
  const [showAuthLock, setShowAuthLock] = useState(true);
  const navigationProps = { onOpenMap, onOpenCommunity, onOpenGroupbuy };
  const monthlyVisitRecords = useMemo(() => {
    const now = new Date();
    return visitRecords.filter((record) => {
      const visitedDate = new Date(record.visited_at);
      return (
        !Number.isNaN(visitedDate.getTime()) &&
        visitedDate.getFullYear() === now.getFullYear() &&
        visitedDate.getMonth() === now.getMonth()
      );
    });
  }, [visitRecords]);

  if (view === "likes") {
    return (
      <LikeDetail
        places={likedPlaces}
        products={likedGroupbuyProducts}
        onBack={() => setView("home")}
        navigationProps={navigationProps}
      />
    );
  }

  if (view === "orders") {
    return (
      <PurchasesDetail
        records={groupbuyPurchaseRecords}
        onBack={() => setView("home")}
        navigationProps={navigationProps}
      />
    );
  }

  if (view === "savings") {
    return (
      <SavingsDetail
        records={monthlyVisitRecords}
        monthlySaving={monthlySaving}
        onBack={() => setView("home")}
        navigationProps={navigationProps}
      />
    );
  }

  if (view === "settings") {
    return <SettingsDetail onBack={() => setView("home")} navigationProps={navigationProps} />;
  }

  return (
    <section className="phone-page my-page figma-mypage">
      <header className="mypage-header">
        <div className="mypage-gnb">
          <div className="figma-brand">
            <div className="figma-logo-mark">
              <img src={figmaAssets.logoTop} alt="" />
              <img src={figmaAssets.logoBottom} alt="" />
            </div>
            <img className="figma-logo-text" src={figmaAssets.logoText} alt="기특기특" />
          </div>
          <div className="mypage-header-actions">
            <HeaderAction src={figmaAssets.signUpIcon} label="소셜 로그인" action="login_social" onClick={() => onOpenAuth?.("login")} />
            <HeaderAction src={figmaAssets.loginIcon} label="아이디 로그인" action="login_email" onClick={() => onOpenAuth?.("id-login")} />
          </div>
        </div>

        <div className="mypage-title">
          <h1>마이페이지</h1>
          <p>오늘도 알뜰하게, 잘하고 있어요! 💜</p>
        </div>
      </header>

      <button
        id="btn-mypage-profile-open_customize"
        type="button"
        className={isAuthenticated ? "mypage-level-card" : "mypage-level-card locked"}
        aria-disabled={!isAuthenticated}
        data-event="click_customize"
        data-page="mypage"
        data-section="profile"
        data-action={isAuthenticated ? "open_customize" : "locked_customize"}
        data-label="profile_customize"
        onClick={isAuthenticated ? onOpenCustomize : undefined}
      >
        <div className="mypage-avatar">
          <img src={isAuthenticated ? figmaAssets.myLevel01Character : figmaAssets.myGuestCharacter} alt="기특이" />
        </div>
        <div className="mypage-level-copy">
          <div>
            <strong>{isAuthenticated ? `${nickname} · 새싹 절약러` : "게스트 · 로그인 필요"}</strong>
            <em>{isAuthenticated ? "LV.1" : "LOCK"}</em>
          </div>
          <p>{isAuthenticated ? "서울 강북구" : "회원가입 후 이용할 수 있어요"}</p>
          <small>{isAuthenticated ? <>다음 등급까지 <b>2,000P</b> 남았어요</> : "로그인하면 절약 기록과 레벨이 저장돼요"}</small>
          <span className="mypage-progress"><i /></span>
        </div>
        <img className="mypage-chevron" src={figmaAssets.myChevron} alt="" />
      </button>

      <button
        id="btn-mypage-customize-open"
        type="button"
        className={isAuthenticated ? "mypage-custom-card" : "mypage-custom-card locked"}
        aria-disabled={!isAuthenticated}
        data-event="click_customize"
        data-page="mypage"
        data-section="customize"
        data-action={isAuthenticated ? "open_customize" : "locked_customize"}
        data-label="customize"
        onClick={isAuthenticated ? onOpenCustomize : undefined}
      >
        <span><img src={figmaAssets.mySparkle} alt="" /></span>
        <div>
          <strong>캐릭터 꾸미기</strong>
          <small>{isAuthenticated ? "내 기특이를 원하는 스타일로 꾸며보세요" : "회원가입/로그인 후 이용할 수 있어요"}</small>
        </div>
        <img className="row-chevron" src={figmaAssets.myChevron} alt="" />
      </button>

      {!isAuthenticated && (
        <>
          {showAuthLock && (
            <section className="mypage-auth-lock-card">
              <button
                id="btn-mypage-auth_lock-close"
                type="button"
                className="mypage-auth-lock-close"
                aria-label="로그인 안내 닫기"
                data-event="click_close"
                data-page="mypage"
                data-section="auth_lock"
                data-action="close"
                data-label="auth_lock"
                onClick={() => setShowAuthLock(false)}
              >
                ×
              </button>
              <div className="mypage-auth-lock-copy">
                <span>게스트 모드</span>
                <strong>
                  로그인하면
                  <br />
                  기특한 기록이 저장돼요
                </strong>
                <p>
                  절약 금액 확인, 캐릭터 꾸미기,
                  <br />
                  커뮤니티와 공동구매 참여를 할 수 있어요.
                </p>
              </div>
              <img className="mypage-auth-lock-character" src={figmaAssets.myGuestPopupCharacter} alt="게스트 기특이" />
              <button
                type="button"
                className="mypage-auth-lock-cta"
                onClick={() => onOpenAuth?.("login", "mypage", "mypage-lock")}
              >
                회원가입/로그인하고 이용하기
              </button>
            </section>
          )}
          <MyPageNav {...navigationProps} />
        </>
      )}

      {!isAuthenticated ? null : (
        <>

      <section className="mypage-saving-card">
        <div>
          <h2>절약 금액</h2>
          <button type="button">전체기간</button>
        </div>
        <p>총 절약 금액</p>
        <strong>{formatWon(totalSaving)}</strong>
        <ul>
          <li className="saving-clickable">
            <button type="button" className="mypage-saving-item-button" onClick={() => setView("savings")}>
              <span className="saving-mini-icon"><img src={figmaAssets.mySaving} alt="" /></span>
              <span>
                <small>이번 달 절약</small>
                <b>{formatWon(monthlySaving)}</b>
              </span>
            </button>
          </li>
          <li className="saving-clickable">
            <button type="button" className="mypage-saving-item-button" onClick={() => setView("orders")}>
              <span className="saving-mini-icon purple"><img src={figmaAssets.mySale} alt="" /></span>
              <span>
                <small>이번 달 구매</small>
                <b>{monthlyPurchaseCount.toLocaleString("ko-KR")}건</b>
              </span>
            </button>
          </li>
          <li>
            <span className="saving-mini-icon"><img src={figmaAssets.myAward} alt="" /></span>
            <small>전체 절약 랭킹</small>
            <b>상위 18%</b>
          </li>
        </ul>
      </section>

      <section className="mypage-list-card">
        <MyListRow
          icon={figmaAssets.myHeart}
          title="찜 목록"
          copy="찜해둔 가성비 스팟을 확인해보세요"
          action="open_likes"
          onClick={() => setView("likes")}
        />
        <MyListRow
          icon={figmaAssets.myBag}
          title="공동구매 내역"
          copy="참여한 공동구매 내역을 확인해보세요"
          action="open_groupbuy_orders"
          onClick={() => setView("orders")}
        />
      </section>

      <section className="mypage-shortcuts">
        <button id="btn-mypage-shortcuts-customer_center" type="button" data-event="click_customer_center" data-page="mypage" data-section="shortcuts" data-action="customer_center" data-label="customer_center" onClick={onOpenCustomerCenter}>
          <img src={figmaAssets.myMegaphone} alt="" />
          고객센터
        </button>
        <button id="btn-mypage-shortcuts-settings" type="button" data-event="click_settings" data-page="mypage" data-section="shortcuts" data-action="settings" data-label="settings" onClick={() => setView("settings")}>
          <img src={figmaAssets.mySettings} alt="" />
          설정
        </button>
      </section>

      <MyPageNav {...navigationProps} />
        </>
      )}
    </section>
  );
}
