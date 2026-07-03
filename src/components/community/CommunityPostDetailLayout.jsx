import { useEffect, useState } from "react";
import BottomNavigation from "../BottomNavigation.jsx";
import CommunityCommentSection from "./CommunityCommentSection.jsx";
import CommunityPostContent from "./CommunityPostContent.jsx";

const CURRENT_USER_ID = "current-user";

export default function CommunityPostDetailLayout({
  post,
  onBack,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  onOpenMapPlace,
  currentNickname = "게스트",
  isAuthenticated = false,
}) {
  const postKey = post.id ?? `${post.category}-${post.title}`;
  const [actions, setActions] = useState(() => createActionStates(post.actions));

  useEffect(() => {
    setActions(createActionStates(post.actions));
  }, [postKey, post.actions]);

  const handleShareClick = async () => {
    const shareText = `${post.title} - ${post.address?.strong || post.category}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
  };

  const handleActionClick = async (label) => {
    if (label === "공유하기") {
      await handleShareClick();
    }

    setActions((prevActions) =>
      prevActions.map((action) => {
        if (action.label !== label) return action;

        const hasClicked = action.clickedUserIds.includes(CURRENT_USER_ID);

        return {
          ...action,
          count: hasClicked ? Math.max(0, action.count - 1) : action.count + 1,
          clickedUserIds: hasClicked
            ? action.clickedUserIds.filter((userId) => userId !== CURRENT_USER_ID)
            : [...action.clickedUserIds, CURRENT_USER_ID],
        };
      }),
    );
  };

  return (
    <main className="page-shell">
      <article
        className={
          post.pageClassName
            ? `pdp-frame ${post.pageClassName}`
            : "pdp-frame"
        }
        aria-label="게시글 상세"
      >
        <header className="pdp-header">
          <button
            className="pdp-icon-button pdp-back-button"
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <img src={post.header.backIcon} alt="" />
          </button>
          <h1>{post.header.title}</h1>
        </header>

        <span className="pdp-category">{post.category}</span>

        <CommunityPostContent post={post} onAddressClick={onOpenMapPlace} />

        <section className="pdp-actions" aria-label="게시글 액션">
          {actions.map((action) => {
            const hasClicked = action.clickedUserIds.includes(CURRENT_USER_ID);

            return (
              <button
                key={action.label}
                className={hasClicked ? "is-active" : undefined}
                type="button"
                aria-pressed={hasClicked}
                onClick={() => handleActionClick(action.label)}
              >
                <img src={action.icon} alt="" />
                <span>{action.label}</span>
                <strong>{action.count}</strong>
              </button>
            );
          })}
        </section>

        <CommunityCommentSection
          initialComments={post.comments}
          commentConfig={post.commentConfig}
          currentNickname={currentNickname}
          isAuthenticated={isAuthenticated}
        />

        <BottomNavigation
          onOpenMap={onOpenMap}
          onOpenCommunity={onOpenCommunity}
          onOpenGroupbuy={onOpenGroupbuy}
          onOpenMyPage={onOpenMyPage}
        />
      </article>
    </main>
  );
}

function createActionStates(actions) {
  return actions.map((action) => ({
    ...action,
    count: Number(action.count) || 0,
    clickedUserIds: [],
  }));
}
