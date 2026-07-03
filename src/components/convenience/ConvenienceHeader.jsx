import backIcon from "../../assets/Community_convenience_pdp_all/Back icon.png";
import { figmaAssets } from "../../data/figmaAssets.js";

export default function ConvenienceHeader({ onBack, onOpenAuth }) {
  return (
    <header className="convenience-header">
      <button
        className="convenience-icon-button convenience-back-button"
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
      >
        <img src={backIcon} alt="" />
      </button>
      <h1>이달의 행사</h1>
      <div className="convenience-header-actions">
        <button className="convenience-icon-button" type="button" aria-label="회원가입" onClick={() => onOpenAuth?.("login")}>
          <img src={figmaAssets.signUpIcon} alt="" />
        </button>
        <button className="convenience-icon-button" type="button" aria-label="로그인" onClick={() => onOpenAuth?.("id-login")}>
          <img src={figmaAssets.loginIcon} alt="" />
        </button>
      </div>
    </header>
  );
}
