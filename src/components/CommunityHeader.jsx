import { figmaAssets } from "../data/figmaAssets.js";

export default function CommunityHeader({ onOpenAuth }) {
  return (
    <header className="community-header">
      <nav className="gnb community-gnb" aria-label="상단 메뉴">
        <div className="figma-brand">
          <div className="figma-logo-mark">
            <img src={figmaAssets.logoTop} alt="" />
            <img src={figmaAssets.logoBottom} alt="" />
          </div>
          <img className="figma-logo-text" src={figmaAssets.logoText} alt="기특기특" />
        </div>

        <div className="header-actions mypage-header-actions">
          <button id="btn-community-header-login_social" type="button" aria-label="회원가입" data-event="click_login" data-page="community" data-section="header" data-action="login_social" data-label="social_login" onClick={() => onOpenAuth?.("login")}>
            <img src={figmaAssets.signUpIcon} alt="" />
          </button>
          <button id="btn-community-header-login_email" type="button" aria-label="로그인" data-event="click_login" data-page="community" data-section="header" data-action="login_email" data-label="email_login" onClick={() => onOpenAuth?.("id-login")}>
            <img src={figmaAssets.loginIcon} alt="" />
          </button>
        </div>
      </nav>

      <div className="page-title">
        <h1>커뮤니티</h1>
        <p>기특한 하루, 함께 만들어가요! 💜</p>
      </div>
    </header>
  );
}
