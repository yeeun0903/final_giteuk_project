import searchIcon from "../../assets/Community_convenience_pdp_all/Button_Search.png";

export default function ConvenienceSearchBar({ value, onChange }) {
  return (
    <label className="convenience-search">
      <img src={searchIcon} alt="" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="상품명을 검색해보세요"
      />
      {value && (
        <button
          className="convenience-search-clear"
          type="button"
          onClick={() => onChange("")}
          aria-label="검색어 지우기"
        >
          ×
        </button>
      )}
    </label>
  );
}
