import sortIcon from "../../../assets/GroupBuy_Main/Sort order icon.png";

const tabs = [
  { label: "전체", trackingLabel: "all" },
  { label: "생활용품", trackingLabel: "household" },
  { label: "식품", trackingLabel: "food" },
  { label: "패션뷰티", trackingLabel: "fashion_beauty" },
];

export default function GroupBuyCategoryTabs({ activeTab, onChange }) {
  return (
    <div className="groupbuy-toolbar">
      <div className="groupbuy-tabs" role="tablist" aria-label="상품 카테고리">
        {tabs.map((tab) => (
          <button
            id={`btn-groupbuy-tabs-${tab.trackingLabel}`}
            className={tab.label === activeTab ? "groupbuy-tab groupbuy-tab-active" : "groupbuy-tab"}
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={tab.label === activeTab}
            data-event="click_category"
            data-page="groupbuy"
            data-section="tabs"
            data-action={`category_${tab.trackingLabel}`}
            data-label={tab.trackingLabel}
            onClick={() => onChange(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button id="btn-groupbuy-toolbar-sort" className="groupbuy-sort-button" type="button" aria-label="정렬 기준" data-event="click_sort" data-page="groupbuy" data-section="toolbar" data-action="sort" data-label="latest">
        <span>최신순</span>
        <img src={sortIcon} alt="" />
      </button>
    </div>
  );
}
