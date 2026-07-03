const tabs = [
  { label: "전체", trackingLabel: "all" },
  { label: "이용후기", trackingLabel: "review" },
  { label: "할인정보", trackingLabel: "sale" },
  { label: "제보하기", trackingLabel: "report" },
];

export default function CommunityTabs({ activeTab, onChange }) {
  return (
    <div className="community-tabs" role="tablist" aria-label="게시글 카테고리">
      {tabs.map((tab) => (
        <button
          id={`btn-community-tabs-${tab.trackingLabel}`}
          key={tab.label}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.label}
          className={activeTab === tab.label ? "tab-button active" : "tab-button"}
          data-event="click_category"
          data-page="community"
          data-section="tabs"
          data-action={`category_${tab.trackingLabel}`}
          data-label={tab.trackingLabel}
          onClick={() => onChange(tab.label)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
