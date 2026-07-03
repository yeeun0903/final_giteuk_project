export default function CommunityPostAuthorMeta({ author, manageActions = null }) {
  return (
    <div className="pdp-author">
      <img className="pdp-author-avatar" src={author.avatar} alt="" />
      <div className="pdp-author-copy">
        <div className="pdp-author-line">
          <span>{author.name}</span>
          {manageActions}
          <button className="pdp-level-badge" type="button">
            {author.level}
          </button>
        </div>
        <div className="pdp-author-meta">
          <span>{author.time}</span>
          <span>{author.views}</span>
        </div>
      </div>
    </div>
  );
}
