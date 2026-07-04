import React, { useMemo, useState } from "react";
import CharacterPreview from "./CharacterPreview.jsx";
import { figmaAssets } from "../data/figmaAssets.js";
import { initialSelection, itemsByCategory, tabs } from "../data/items.js";

const slotMap = {
  clothes: "clothes",
  hat: "hat",
  bag: "bag",
  glasses: "glasses"
};

function pickRandom(items) {
  if (!items?.length) return "";
  return items[Math.floor(Math.random() * items.length)].id;
}

export default function CharacterCustomizePage({
  onBack,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  nickname = "기특한 사용자",
  level = 1,
  points = 0,
}) {
  const [activeTab, setActiveTab] = useState("bag");
  const [selection, setSelection] = useState({ ...initialSelection, clothes: "clothes2", hat: "hat" });
  const [motion, setMotion] = useState(false);
  const [toast, setToast] = useState("");

  const activeItems = useMemo(() => itemsByCategory[activeTab] || [], [activeTab]);
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const activeTabMeta = tabs[activeTabIndex] || tabs[0];

  const selectItem = (itemId) => {
    const slot = slotMap[activeTab];
    setSelection((prev) => ({
      ...prev,
      [slot]: prev[slot] === itemId ? "" : itemId
    }));
  };

  const randomize = () => {
    setSelection((prev) => ({
      ...prev,
      clothes: pickRandom(itemsByCategory.clothes),
      hat: pickRandom(itemsByCategory.hat),
      bag: pickRandom(itemsByCategory.bag),
      glasses: pickRandom(itemsByCategory.glasses)
    }));
  };

  const clearAll = () => {
    setSelection({ ...initialSelection, clothes: "", hat: "", bag: "", glasses: "" });
  };

  const saveLook = () => {
    setToast("저장되었습니다");
    window.setTimeout(() => setToast(""), 1600);
  };

  return (
    <section className="phone-page customize-page">
      <header className="customize-top">
        <button className="ghost-button" onClick={onBack} aria-label="뒤로가기">
          <img src={figmaAssets.characterBack} alt="" />
        </button>
        <h1>캐릭터 꾸미기</h1>
        <div className="customize-header-actions">
          <strong className="point-pill">
            <img src={figmaAssets.characterPoint} alt="" />
            {points.toLocaleString("ko-KR")}P
          </strong>
          <button type="button" className="customize-menu-button" aria-label="메뉴">
            <img src={figmaAssets.characterMenu} alt="" />
          </button>
        </div>
      </header>

      <section className="user-strip">
        <img src={figmaAssets.myLevel01Character} alt={nickname} />
        <div className="customize-user-copy">
          <strong>
            <span className="customize-nickname">{nickname}</span>
            <span className="customize-level-pill">LV.{level}</span>
          </strong>
          <p>
            새싹 절약러
            <img className="inline-chevron" src={figmaAssets.characterChevron} alt="" />
          </p>
        </div>
        <div className="customize-user-actions">
          <button type="button" onClick={() => setSelection({ ...initialSelection, clothes: "clothes2", hat: "hat" })}>
            되돌리기
          </button>
          <button type="button" onClick={saveLook}>저장하기</button>
        </div>
      </section>

      <section className="hero-preview">
        <div className="side-actions left">
          <button onClick={randomize}>랜덤<br />코디</button>
          <button onClick={clearAll}>전체<br />벗기</button>
        </div>
        <CharacterPreview selection={selection} motion={motion} />
        <div className="side-actions right">
          <button onClick={() => setMotion((value) => !value)}>
            모션<br />{motion ? "끄기" : "보기"}
          </button>
        </div>
      </section>

      <nav className="category-tabs" aria-label="꾸미기 카테고리">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`tab-icon ${tab.id}`}>
              <img src={tab.icon} alt="" />
            </span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="item-section">
        <div className="section-row">
          <div>
            <span className="customize-frame-label">
              Character_Customization {String(activeTabIndex + 1).padStart(2, "0")}
            </span>
            <h2>{activeTabMeta.label}</h2>
          </div>
          <label className="owned-toggle">
            보유만 보기
            <input type="checkbox" defaultChecked />
            <span aria-hidden="true" />
          </label>
        </div>

        <div className="item-grid">
          {activeItems.map((item) => {
            const slot = slotMap[activeTab];
            const selected = selection[slot] === item.id;

            return (
              <button
                key={item.id}
                className={`item-card ${selected ? "selected" : ""}`}
                onClick={() => selectItem(item.id)}
              >
                <span className="item-visual" style={{ "--swatch": item.swatch }}>
                  {item.image ? <img src={item.image} alt="" /> : <i />}
                </span>
                <strong>{item.name}</strong>
                <small>{item.price}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="hot-items">
        <div>
          <h2>보유 아이템</h2>
          <p>옷, 모자, 가방, 선글라스를 조합해보세요</p>
        </div>
        <div className="hot-row">
          {Object.values(itemsByCategory).flat().slice(0, 3).map((item) => (
            <article key={item.id}>
              <span>OWN</span>
              <img src={item.image} alt="" />
              <b>{item.name}</b>
              <small>{item.price}</small>
            </article>
          ))}
        </div>
      </section>

      <nav className="figma-bottom-nav character-bottom-nav">
        <button type="button" onClick={onOpenMap}>
          <img src={figmaAssets.characterNavMap} alt="" />
          <span>지도</span>
        </button>
        <button type="button" onClick={onOpenCommunity}>
          <img src={figmaAssets.characterNavCommunity} alt="" />
          <span>커뮤니티</span>
        </button>
        <button type="button" onClick={onOpenGroupbuy}>
          <img src={figmaAssets.characterNavBuy} alt="" />
          <span>공동구매</span>
        </button>
        <button type="button" className="active" onClick={onBack}>
          <img src={figmaAssets.characterNavMy} alt="" />
          <span>마이페이지</span>
        </button>
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
