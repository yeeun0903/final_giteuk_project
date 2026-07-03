import thumbUpIcon from "../assets/Community_main/Button_ThumbUp.png";
import CommunityPhotoSection from "./CommunityPhotoSection.jsx";

export default function CommunityPostCard({ post, onClick }) {
  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      id={`btn-community-post_list-open_${post.id}`}
      type="button"
      className={onClick ? "post-card clickable" : "post-card"}
      disabled={!onClick}
      data-event="click_community_post"
      data-page="community"
      data-section="post_list"
      data-action="open_post"
      data-label={String(post.id)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="post-info">
        <span className={`post-badge ${post.badgeTone}`}>{post.badge}</span>
        <div className="post-copy">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
        <div className="post-meta">
          <span>
            {post.location} · {post.time}
          </span>
          <span className="like-count">
            <img src={thumbUpIcon} alt="" />
            {post.likes}
          </span>
        </div>
      </div>
      <CommunityPhotoSection
        variant={post.photoVariant || "placeholder"}
        src={post.photoUrl}
      />
    </button>
  );
}
