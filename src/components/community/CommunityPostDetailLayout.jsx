import { useEffect, useMemo, useState } from "react";
import BottomNavigation from "../BottomNavigation.jsx";
import CommunityCommentSection from "./CommunityCommentSection.jsx";
import CommunityPostContent from "./CommunityPostContent.jsx";
import { figmaAssets } from "../../data/figmaAssets.js";
import { createComment, deleteComment, listComments, updateComment } from "../../lib/database.js";

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
  currentUserId = null,
  isAuthenticated = false,
  onUpdatePost,
  onDeletePost,
}) {
  const postKey = useMemo(() => getPostStorageKey(post), [post]);
  const [actions, setActions] = useState(() => createActionStates(post.actions));
  const [remoteComments, setRemoteComments] = useState([]);
  const canManagePost = Boolean(post.canManage);

  useEffect(() => {
    setActions(createActionStates(post.actions));
  }, [postKey, post.actions]);

  useEffect(() => {
    let cancelled = false;

    listComments({ postKey, postId: post.dbId })
      .then((rows) => {
        if (cancelled) return;
        setRemoteComments(rows.map((row) => mapCommentRow(row, currentUserId)));
      })
      .catch((error) => console.error("댓글 목록 불러오기 실패", error));

    return () => {
      cancelled = true;
    };
  }, [currentUserId, post.dbId, postKey]);

  const comments = useMemo(() => {
    const remoteIds = new Set(remoteComments.map((comment) => String(comment.id)));
    const baseComments = (post.comments || []).filter((comment) => !remoteIds.has(String(comment.id)));
    return [...remoteComments, ...baseComments];
  }, [post.comments, remoteComments]);

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

  const handleCreateComment = async (body) => {
    const row = await createComment({
      userId: currentUserId,
      postId: post.dbId,
      postKey,
      content: body,
      authorName: isAuthenticated ? currentNickname : "게스트",
    });
    const mappedComment = mapCommentRow(row, currentUserId, currentNickname, isAuthenticated);
    setRemoteComments((prevComments) => [mappedComment, ...prevComments]);
    return mappedComment;
  };

  const handleUpdateComment = async (commentId, body) => {
    await updateComment({ userId: currentUserId, commentId, content: body });
    setRemoteComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, body } : comment,
      ),
    );
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({ userId: currentUserId, commentId });
    setRemoteComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  const handleEditPost = () => {
    const nextTitle = window.prompt("제목을 수정해주세요.", post.title)?.trim();
    if (!nextTitle) return;
    const nextBody = window.prompt("내용을 수정해주세요.", post.body)?.trim();
    if (!nextBody) return;
    onUpdatePost?.(post.id, { title: nextTitle, body: nextBody });
  };

  const handleDeletePost = () => {
    if (!window.confirm("게시글을 삭제할까요?")) return;
    onDeletePost?.(post.id);
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

        <CommunityPostContent
          post={post}
          onAddressClick={onOpenMapPlace}
          manageActions={
            canManagePost ? (
              <div className="pdp-post-manage">
                <button type="button" onClick={handleEditPost}>수정</button>
                <button type="button" onClick={handleDeletePost}>삭제</button>
              </div>
            ) : null
          }
        />

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
          initialComments={comments}
          commentConfig={post.commentConfig}
          currentNickname={currentNickname}
          isAuthenticated={isAuthenticated}
          onCreateComment={handleCreateComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
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

function getPostStorageKey(post) {
  return post.storageKey || (post.dbId ? `community-post-${post.dbId}` : `seed-${post.category}-${post.title}`);
}

function mapCommentRow(row, currentUserId, fallbackNickname = "게스트", isAuthenticated = false) {
  const isOwner = Boolean(currentUserId && row.user_id === currentUserId);
  return {
    id: row.id,
    avatar: row.user_id ? figmaAssets.myLevel01Character : figmaAssets.myGuestCharacter,
    name: row.author_name || (isOwner && isAuthenticated ? fallbackNickname : "게스트"),
    time: formatRelativeTime(row.created_at),
    body: row.content,
    likes: 0,
    likedUserIds: [],
    canManage: isOwner,
  };
}

function formatRelativeTime(value) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs) || diffMs < 60_000) return "방금 전";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}
