import CommunityHeader from "./CommunityHeader.jsx";
import CommunityTabs from "./CommunityTabs.jsx";
import CommunityPostCard from "./CommunityPostCard.jsx";
import BottomNavigation from "./BottomNavigation.jsx";
import chevronRight from "../assets/Community_main/chevron-right.png";
import mascotImage from "../assets/Community_main/image 37.png";
import polygonImage from "../assets/Community_main/Polygon 2.png";
import postingIcon from "../assets/Community_main/Button_Posting.png";
import sortIcon from "../assets/Community_main/Sort order icon.png";
import storeImage from "../assets/Community_main/Image_store.png";

export default function CommunityMain({
  posts,
  activeTab,
  onTabChange,
  onOpenPost,
  onOpenSalePost,
  onOpenSojuSalePost,
  onOpenReportPost,
  onOpenUserPost,
  onOpenPosting,
  onOpenConveniencePdpAll,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  onOpenAuth,
}) {
  const visiblePosts = posts.filter(
    (post) => activeTab === "전체" || post.badge === activeTab,
  );

  const handlePromoKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenConveniencePdpAll();
    }
  };

  const getPostClick = (post) => {
    if (post.userPage) return () => onOpenUserPost(post);
    if (post.detailPage) return onOpenPost;
    if (post.salePage) return onOpenSalePost;
    if (post.sojuSalePage) return onOpenSojuSalePost;
    if (post.reportPage) return onOpenReportPost;
    return undefined;
  };

  const handleOpenPosting = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpenPosting?.();
  };

  return (
    <main className="page-shell">
      <section className="community-frame" aria-label="Community main">
        <CommunityHeader onOpenAuth={onOpenAuth} />

        <section className="community-body">
          <button
            id="btn-community-promo-open_events"
            type="button"
            className="promo-card clickable"
            aria-label="이달의 행사"
            data-event="click_convenience_events"
            data-page="community"
            data-section="promo"
            data-action="open_events"
            data-label="convenience_events"
            onClick={onOpenConveniencePdpAll}
            onKeyDown={handlePromoKeyDown}
          >
            <div className="promo-copy">
              <span className="promo-label">배달앱 행사</span>
              <div>
                <p className="promo-brands">GS25 · CU · 7-ELEVEN · emart24</p>
                <h2>행사모음.zip</h2>
              </div>
              <p className="promo-description">
                인기 간식부터 음료까지
                <br />
                기특하게 득템하세요!
              </p>
              <span className="promo-button">
                자세히 보기
                <img src={chevronRight} alt="" />
              </span>
            </div>

            <div className="promo-visual" aria-hidden="true">
              <img className="store-image" src={storeImage} alt="" />
              <img className="mascot" src={mascotImage} alt="" />
              <div className="bundle-badge">
                <img src={polygonImage} alt="" />
                <span>1+1</span>
              </div>
            </div>
          </button>

          <section className="post-section" aria-label="커뮤니티 게시글">
            <div className="post-toolbar">
              <CommunityTabs activeTab={activeTab} onChange={onTabChange} />
              <button id="btn-community-post_toolbar-sort" className="sort-button" type="button" data-event="click_sort" data-page="community" data-section="post_toolbar" data-action="sort" data-label="latest">
                최신순
                <img className="sort-icon" src={sortIcon} alt="" />
              </button>
            </div>
            <div className="post-list">
              {visiblePosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onClick={getPostClick(post)}
                />
              ))}
            </div>
          </section>
        </section>

        <button
          id="btn-community-floating-write"
          className="write-button"
          type="button"
          data-event="click_write"
          data-page="community"
          data-section="floating_action"
          data-action="write"
          data-label="write_post"
          onClick={handleOpenPosting}
        >
          <img src={postingIcon} alt="" />
          글쓰기
        </button>

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
