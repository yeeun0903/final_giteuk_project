import searchIcon from "../../assets/GroupBuy_Main/Search Icon.png";

export default function GroupBuySearchBar({ value, onChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="groupbuy-search" role="search" onSubmit={handleSubmit}>
      <img src={searchIcon} alt="" />
      <input
        type="search"
        aria-label="상품명 검색"
        placeholder="상품명을 검색해보세요"
        value={value}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
}
