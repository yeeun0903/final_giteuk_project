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
        <button id="btn-convenience-header-login_social" className="convenience-icon-button" type="button" aria-label="회원가입" data-event="click_login" data-page="convenience" data-section="header" data-action="login_social" data-label="social_login" onClick={() => onOpenAuth?.("login")}>
          <img src={figmaAssets.signUpIcon} alt="" />
        </button>
        <button id="btn-convenience-header-login_email" className="convenience-icon-button" type="button" aria-label="로그인" data-event="click_login" data-page="convenience" data-section="header" data-action="login_email" data-label="email_login" onClick={() => onOpenAuth?.("id-login")}>
          <img src={figmaAssets.loginIcon} alt="" />
        </button>
      </div>
    </header>
  );
}
