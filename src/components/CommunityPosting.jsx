import { useRef, useState } from "react";
import backIcon from "../../assets/Community_posting/Back icon.png";
import imageAddIcon from "../../assets/Community_posting/image-add.png";
import addressIcon from "../../assets/Community_posting/Button_Address.png";
import editIcon from "../../assets/Community_posting/edit-contained.png";
import chevronDownIcon from "../../assets/Community_posting/chevron-down.png";
import BottomNavigation from "./BottomNavigation.jsx";

const categories = ["이용후기", "할인정보", "제보하기"];

export default function CommunityPosting({
  onBack,
  onSubmit,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
}) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const photoInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextCategory = category.trim();
    const nextTitle = title.trim();
    const nextBody = body.trim();

    if (!nextCategory || !nextTitle || !nextBody) return;

    onSubmit?.({
      category: nextCategory,
      title: nextTitle,
      body: nextBody,
      photoUrl,
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="page-shell">
      <section className="posting-frame" aria-label="글쓰기">
        <header className="posting-header">
          <button
            className="posting-icon-button posting-back-button"
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
          >
            <img src={backIcon} alt="" />
          </button>
          <h1>글쓰기</h1>
        </header>

        <form className="posting-form" onSubmit={handleSubmit}>
          <div className="posting-category-wrap">
            <button
              className="posting-category-row"
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              aria-expanded={isCategoryOpen}
            >
              <span
                className={
                  category
                    ? "posting-category-value"
                    : "posting-category-value placeholder"
                }
              >
                {category || "주제를 선택해주세요."}
              </span>
              <img src={chevronDownIcon} alt="" aria-hidden="true" />
            </button>

            {isCategoryOpen && (
              <div className="posting-category-menu">
                {categories.map((item) => (
                  <button
                    key={item}
                    className="posting-category-option"
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="sr-only" htmlFor="posting-title">
            제목
          </label>
          <input
            id="posting-title"
            className="posting-title-input"
            type="text"
            placeholder="제목을 작성해주세요."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="posting-body">
            내용
          </label>
          <textarea
            id="posting-body"
            className={
              photoUrl ? "posting-body-input has-photo" : "posting-body-input"
            }
            placeholder="어떤 이야기를 공유하고 싶으신가요?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
          />

          {photoUrl && (
            <div className="posting-photo-preview">
              <img src={photoUrl} alt="선택한 사진 미리보기" />
            </div>
          )}

          <div className="posting-bottom-actions">
            <input
              ref={photoInputRef}
              className="posting-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <button
              className="posting-secondary-button"
              type="button"
              onClick={() => photoInputRef.current?.click()}
            >
              <img src={imageAddIcon} alt="" />
              사진
            </button>
            <button className="posting-secondary-button" type="button">
              <img src={addressIcon} alt="" />
              위치
            </button>
            <button className="posting-submit-button" type="submit">
              <img src={editIcon} alt="" />
              게시
            </button>
          </div>
        </form>

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
