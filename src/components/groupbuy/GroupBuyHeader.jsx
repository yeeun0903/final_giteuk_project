import { figmaAssets } from "../../data/figmaAssets.js";

export default function GroupBuyHeader({ onOpenAuth }) {
  return (
    <header className="groupbuy-header">
      <div className="groupbuy-gnb">
        <div className="figma-brand" aria-label="기특기특">
          <div className="figma-logo-mark" aria-hidden="true">
            <img src={figmaAssets.logoTop} alt="" />
            <img src={figmaAssets.logoBottom} alt="" />
          </div>
          <img className="figma-logo-text" src={figmaAssets.logoText} alt="기특기특" />
        </div>

        <div className="groupbuy-header-actions mypage-header-actions" aria-label="상단 메뉴">
          <button id="btn-groupbuy-header-login_social" type="button" aria-label="회원가입" data-event="click_login" data-page="groupbuy" data-section="header" data-action="login_social" data-label="social_login" onClick={() => onOpenAuth?.("login")}>
            <img src={figmaAssets.signUpIcon} alt="" />
          </button>
          <button id="btn-groupbuy-header-login_email" type="button" aria-label="로그인" data-event="click_login" data-page="groupbuy" data-section="header" data-action="login_email" data-label="email_login" onClick={() => onOpenAuth?.("id-login")}>
            <img src={figmaAssets.loginIcon} alt="" />
          </button>
        </div>
      </div>

      <div className="groupbuy-page-title">
        <h1>공동구매</h1>
        <p>함께 사면 더 저렴해요! <span aria-hidden="true">💜</span></p>
      </div>
    </header>
  );
}
