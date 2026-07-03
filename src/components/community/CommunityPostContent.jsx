import { useState } from "react";
import CommunityPostAuthorMeta from "./CommunityPostAuthorMeta.jsx";

export default function CommunityPostContent({ post, onAddressClick, manageActions = null }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const images = post.images ?? [];
  const hasLargePhoto = images.some((image) => image.variant === "large");

  return (
    <section className="pdp-content">
      <h2>{post.title}</h2>

      <CommunityPostAuthorMeta author={post.author} />
      {manageActions}

      <p className="pdp-body-text">{renderTextLines(post.body)}</p>

      {images.length > 0 && (
        <div
          className={
            hasLargePhoto
              ? "pdp-photo-row pdp-photo-row-large"
              : "pdp-photo-row"
          }
        >
          {images.map((image) => (
            <button
              key={image.thumbnail}
              className={
                image.variant === "large"
                  ? "pdp-photo-button pdp-photo-button-large"
                  : "pdp-photo-button"
              }
              type="button"
              onClick={() => setSelectedPhoto(image.full)}
            >
              <img src={image.thumbnail} alt="" />
            </button>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <button
          className="pdp-photo-preview"
          type="button"
          onClick={() => setSelectedPhoto(null)}
          aria-label="사진 크게 보기 닫기"
        >
          <img src={selectedPhoto} alt="" />
        </button>
      )}

      {post.address && (
        <button className="pdp-address" type="button" onClick={() => onAddressClick?.(post)}>
          <img src={post.address.icon} alt="" />
          <span>
            {post.address.text}{" "}
            {post.address.strong && <strong>{post.address.strong}</strong>}
          </span>
          <img src={post.address.chevronIcon} alt="" />
        </button>
      )}
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
