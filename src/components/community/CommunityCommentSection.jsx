import { useEffect, useState } from "react";
import { figmaAssets } from "../../data/figmaAssets.js";

const CURRENT_USER_ID = "current-user";

export default function CommunityCommentSection({
  initialComments,
  commentConfig,
  currentNickname = "게스트",
  isAuthenticated = false,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}) {
  const [comments, setComments] = useState(() =>
    createCommentStates(initialComments),
  );
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    setComments(createCommentStates(initialComments));
  }, [initialComments]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const body = commentInput.trim();
    if (!body) return;

    const optimisticComment = {
      id: `local-${Date.now()}`,
      avatar: isAuthenticated
        ? figmaAssets.myLevel01Character
        : figmaAssets.myGuestCharacter,
      name: isAuthenticated ? currentNickname : "게스트",
      time: "방금 전",
      body,
      likes: 0,
      likedUserIds: [],
      canManage: isAuthenticated,
    };

    setComments((prevComments) => [optimisticComment, ...prevComments]);
    setCommentInput("");

    try {
      const savedComment = await onCreateComment?.(body);
      if (!savedComment) return;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === optimisticComment.id ? savedComment : comment,
        ),
      );
    } catch (error) {
      console.error("댓글 저장 실패", error);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== optimisticComment.id),
      );
      window.alert("댓글 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleCommentEditClick = async (comment) => {
    const nextBody = window.prompt("댓글을 수정해주세요.", comment.body);
    const trimmedBody = nextBody?.trim();
    if (!trimmedBody || trimmedBody === comment.body) return;

    const previousComments = comments;
    setComments((prevComments) =>
      prevComments.map((item) =>
        item.id === comment.id ? { ...item, body: trimmedBody } : item,
      ),
    );

    try {
      await onUpdateComment?.(comment.id, trimmedBody);
    } catch (error) {
      console.error("댓글 수정 실패", error);
      setComments(previousComments);
      window.alert("본인이 작성한 댓글만 수정할 수 있어요.");
    }
  };

  const handleCommentDeleteClick = async (commentId) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;

    const previousComments = comments;
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));

    try {
      await onDeleteComment?.(commentId);
    } catch (error) {
      console.error("댓글 삭제 실패", error);
      setComments(previousComments);
      window.alert("본인이 작성한 댓글만 삭제할 수 있어요.");
    }
  };

  const handleCommentLikeClick = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        const hasLiked = comment.likedUserIds.includes(CURRENT_USER_ID);

        return {
          ...comment,
          likes: hasLiked ? Math.max(0, comment.likes - 1) : comment.likes + 1,
          likedUserIds: hasLiked
            ? comment.likedUserIds.filter((userId) => userId !== CURRENT_USER_ID)
            : [...comment.likedUserIds, CURRENT_USER_ID],
        };
      }),
    );
  };

  return (
    <section className="pdp-comments" aria-label="댓글">
      <div className="pdp-comment-head">
        <h3>댓글</h3>
        <button type="button">
          최신순
          <img src={commentConfig.sortIcon} alt="" />
        </button>
      </div>

      <div className="pdp-comment-list">
        {comments.map((comment) => {
          const hasLiked = comment.likedUserIds.includes(CURRENT_USER_ID);

          return (
            <article
              key={comment.id}
              className={
                comment.highlighted ? "pdp-comment highlighted" : "pdp-comment"
              }
            >
              <div className="pdp-comment-bubble">
                <img className="pdp-comment-avatar" src={comment.avatar} alt="" />
                <div className="pdp-comment-copy">
                  <div className="pdp-comment-meta">
                    <strong>{comment.name}</strong>
                    <span>{comment.time}</span>
                  </div>
                  <p>{renderTextLines(comment.body)}</p>
                  {comment.canManage && (
                    <div className="pdp-comment-manage">
                      <button type="button" onClick={() => handleCommentEditClick(comment)}>수정</button>
                      <button type="button" onClick={() => handleCommentDeleteClick(comment.id)}>삭제</button>
                    </div>
                  )}
                </div>
              </div>
              <button
                className={hasLiked ? "pdp-comment-like is-active" : "pdp-comment-like"}
                type="button"
                aria-pressed={hasLiked}
                aria-label={`${comment.name} 댓글 좋아요`}
                onClick={() => handleCommentLikeClick(comment.id)}
              >
                <img src={commentConfig.thumbIcon} alt="" />
                {comment.likes}
              </button>
            </article>
          );
        })}
      </div>

      <form className="pdp-comment-form" onSubmit={handleCommentSubmit}>
        <label className="sr-only" htmlFor="pdp-comment-input">
          댓글 입력
        </label>
        <div className="pdp-comment-input">
          <input
            id="pdp-comment-input"
            type="text"
            placeholder="댓글을 입력하세요"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
          />
          <img src={commentConfig.inputIcon} alt="" />
        </div>
        <button type="submit">등록</button>
      </form>
    </section>
  );
}

function renderTextLines(text) {
  return text.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function createCommentStates(comments) {
  return comments.map((comment) => ({
    ...comment,
    likes: Number(comment.likes) || 0,
    likedUserIds: comment.likedUserIds ?? [],
  }));
}
