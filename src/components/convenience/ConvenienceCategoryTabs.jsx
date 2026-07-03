const tabs = [
  { label: "전체", value: "all" },
  { label: "1+1", value: "1+1" },
  { label: "2+1", value: "2+1" },
  { label: "3+1", value: "3+1" },
];

export default function ConvenienceCategoryTabs({ activeFilter, onChange }) {
  return (
    <div className="convenience-tabs-row">
      <div className="convenience-tabs" role="tablist" aria-label="행사 유형">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={
              activeFilter === tab.value
                ? "convenience-tab active"
                : "convenience-tab"
            }
            type="button"
            role="tab"
            aria-selected={activeFilter === tab.value}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
