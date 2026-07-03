import { figmaAssets } from "../../data/figmaAssets.js";

export default function GroupBuyBottomNav({
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
}) {
  const navItems = [
    { label: "지도", trackingLabel: "map", icon: figmaAssets.myNavMap, onClick: onOpenMap },
    { label: "커뮤니티", trackingLabel: "community", icon: figmaAssets.myNavCommunity, onClick: onOpenCommunity },
    { label: "공동구매", trackingLabel: "groupbuy", icon: figmaAssets.myNavBuy, active: true, onClick: onOpenGroupbuy },
    { label: "마이페이지", trackingLabel: "mypage", icon: figmaAssets.myNavMy, onClick: onOpenMyPage },
  ];

  return (
    <nav className="figma-bottom-nav groupbuy-bottom-nav" aria-label="하단 메뉴">
      {navItems.map((item) => (
        <button
          key={item.label}
          id={`btn-groupbuy-bottom_nav-${item.trackingLabel}`}
          type="button"
          className={item.active ? "active" : undefined}
          data-event={`click_nav_${item.trackingLabel}`}
          data-page="groupbuy"
          data-section="bottom_nav"
          data-action={`nav_${item.trackingLabel}`}
          data-label={item.trackingLabel}
          onClick={item.onClick}
        >
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
