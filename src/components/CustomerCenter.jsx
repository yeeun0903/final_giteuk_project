import React, { useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";

const termsSections = [
  {
    title: "제1조 (목적)",
    body: [
      "본 이용약관은 기특기특(이하 “회사”)이 제공하는 지도 기반 생활비 절약 정보 및 커뮤니티 서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다."
    ]
  },
  {
    title: "제2조 (약관의 효력 및 변경)",
    body: [
      "본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.",
      "이용자가 회원가입 또는 서비스를 이용하는 경우 본 약관에 동의한 것으로 간주합니다.",
      "회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.",
      "변경된 약관은 서비스 내 공지사항을 통해 안내하며, 공지 후 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다."
    ]
  },
  {
    title: "제3조 (서비스의 내용)",
    intro: "회사는 다음과 같은 서비스를 제공합니다.",
    bullets: [
      "지도 기반 생활비 절약 정보 제공",
      "착한가격업소 및 기타 절약 정보 제공",
      "사용자 제보 및 업체 등록",
      "리뷰 및 방문 인증",
      "커뮤니티 게시글 및 댓글 작성",
      "공동구매 정보 제공",
      "절약 금액 및 활동 통계 제공",
      "기타 회사가 제공하는 서비스"
    ]
  },
  {
    title: "제4조 (회원가입)",
    body: [
      "서비스를 이용하려는 자는 회사가 정한 절차에 따라 회원가입을 진행해야 합니다.",
      "회원은 정확한 정보를 제공하여야 하며 허위 정보를 등록해서는 안 됩니다.",
      "회원은 자신의 계정을 타인에게 양도하거나 대여할 수 없습니다."
    ]
  },
  {
    title: "제5조 (서비스 이용)",
    body: [
      "서비스는 연중무휴 제공을 원칙으로 합니다.",
      "회사는 시스템 점검, 유지보수 또는 기타 운영상 필요한 경우 서비스의 일부 또는 전부를 일시적으로 중단할 수 있습니다.",
      "회사는 서비스의 기능, 디자인 및 콘텐츠를 변경하거나 개선할 수 있습니다."
    ]
  },
  {
    title: "제6조 (이용자의 책임)",
    body: [
      "이용자는 관련 법령 및 본 약관을 준수하여 서비스를 이용하여야 합니다.",
      "이용자는 자신의 게시물 및 활동에 대한 책임을 부담합니다."
    ]
  },
  {
    title: "제7조 (금지행위)",
    intro: "이용자는 다음 행위를 하여서는 안 됩니다.",
    bullets: [
      "허위 정보 등록",
      "타인의 개인정보 도용",
      "타인의 계정 무단 사용",
      "허위 리뷰 또는 허위 방문 인증",
      "허위 업체 등록",
      "광고 및 스팸 게시물 작성",
      "음란물, 불법 정보 게시",
      "타인을 비방하거나 명예를 훼손하는 행위",
      "서비스 운영을 방해하는 행위",
      "프로그램 해킹 또는 비정상적인 접근",
      "바이러스 및 악성코드 유포",
      "기타 회사가 부적절하다고 판단하는 행위"
    ],
    closing: "회사는 위 행위를 확인한 경우 게시물 삭제, 계정 제한 또는 회원 자격을 제한할 수 있습니다."
  },
  {
    title: "제8조 (게시물의 권리)",
    body: [
      "이용자가 작성한 게시물의 저작권은 작성자에게 있습니다.",
      "이용자는 회사가 서비스 운영, 홍보 및 개선을 위하여 게시물을 사용할 수 있도록 비독점적 사용권을 허락합니다.",
      "회사는 서비스 운영에 적합하지 않은 게시물을 삭제하거나 노출을 제한할 수 있습니다."
    ]
  },
  {
    title: "제9조 (지식재산권)",
    body: [
      "서비스 내 디자인, 로고, 캐릭터, 이미지, 텍스트 및 기타 콘텐츠의 저작권과 지식재산권은 회사 또는 정당한 권리자에게 있습니다.",
      "이를 무단 복제, 배포, 수정 또는 상업적으로 이용할 수 없습니다."
    ]
  },
  {
    title: "제10조 (서비스의 변경 및 중단)",
    intro: "회사는 다음의 경우 서비스의 일부 또는 전부를 변경하거나 중단할 수 있습니다.",
    bullets: ["시스템 점검", "서버 유지보수", "장애 발생", "천재지변", "통신 장애", "기타 서비스 운영상 필요한 경우"],
    closing: "회사는 서비스 중단으로 인한 손해에 대하여 관계 법령에서 정한 경우를 제외하고 책임을 지지 않습니다."
  },
  { title: "제11조 (광고)", body: ["회사는 서비스 내에 광고 또는 제휴 콘텐츠를 게시할 수 있습니다."] },
  { title: "제12조 (개인정보 보호)", body: ["회사는 관련 법령에 따라 이용자의 개인정보를 보호하며 개인정보 처리에 관한 사항은 별도의 개인정보처리방침을 따릅니다."] },
  {
    title: "제13조 (면책)",
    intro: "회사는 다음 사항에 대하여 책임을 지지 않습니다.",
    bullets: [
      "이용자의 귀책사유로 발생한 손해",
      "이용자 간 분쟁",
      "업체가 제공하는 상품 및 서비스",
      "이용자가 게시한 정보의 정확성",
      "천재지변 및 불가항력으로 인한 서비스 중단",
      "이용자의 기기 또는 네트워크 문제"
    ],
    closing: "단, 회사의 고의 또는 중대한 과실이 있는 경우에는 관계 법령에 따릅니다."
  },
  { title: "제14조 (준거법)", body: ["본 약관은 대한민국 법률에 따라 해석됩니다."] },
  { title: "제15조 (관할법원)", body: ["서비스 이용과 관련하여 회사와 이용자 간 분쟁이 발생한 경우 민사소송법에 따른 대한민국의 관할 법원을 제1심 관할 법원으로 합니다."] },
  { title: "부칙", body: ["본 약관은 서비스 오픈일부터 시행합니다."] }
];

const privacySections = [
  {
    title: "제1조 (수집하는 개인정보)",
    intro: "회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.",
    bullets: ["Google 계정 식별자", "이메일 주소", "닉네임", "프로필 사진", "서비스 이용 및 방문 기록"]
  },
  {
    title: "제2조 (개인정보의 이용 목적)",
    bullets: ["회원 식별 및 로그인 유지", "방문 인증 및 절약 금액 통계 제공", "장소 제보 및 커뮤니티 기능 제공", "서비스 개선 및 부정 이용 방지"]
  },
  {
    title: "제3조 (보관 및 파기)",
    body: ["회사는 이용 목적이 달성되거나 회원 탈퇴 요청이 있는 경우 관련 법령에 따라 개인정보를 지체 없이 파기합니다.", "다만 법령상 보관이 필요한 정보는 정해진 기간 동안 별도로 보관할 수 있습니다."]
  },
  {
    title: "제4조 (제3자 제공)",
    body: ["회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 따라 요구되는 경우에는 예외로 합니다."]
  },
  {
    title: "제5조 (이용자의 권리)",
    body: ["이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제 및 처리 정지를 요청할 수 있습니다.", "개인정보 관련 문의는 고객센터를 통해 접수할 수 있습니다."]
  },
  {
    title: "제6조 (안전성 확보 조치)",
    body: ["회사는 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 필요한 기술적·관리적 보호 조치를 취합니다."]
  },
  { title: "부칙", body: ["본 개인정보 처리방침은 서비스 오픈일부터 시행합니다."] }
];

function CustomerHeaderAction({ src, label, action, onClick }) {
  return (
    <button id={`btn-customer-header-${action}`} type="button" aria-label={label} data-event="click_login" data-page="customer" data-section="header" data-action={action} data-label={action} onClick={onClick}>
      <img src={src} alt="" />
    </button>
  );
}

function CustomerRow({ icon, title, copy, onClick }) {
  return (
    <button type="button" className="customer-row" onClick={onClick}>
      <span><img src={icon} alt="" /></span>
      <span>
        <strong>{title}</strong>
        <small>{copy}</small>
      </span>
      <img className="row-chevron" src={figmaAssets.customerChevron} alt="" />
    </button>
  );
}

function CustomerNav({ onOpenMap, onOpenCommunity, onOpenGroupbuy, onOpenMyPage }) {
  return (
    <nav className="figma-bottom-nav mypage-bottom-nav">
      <button type="button" onClick={onOpenMap}>
        <img src={figmaAssets.customerNavMap} alt="" />
        <span>지도</span>
      </button>
      <button type="button" onClick={onOpenCommunity}>
        <img src={figmaAssets.customerNavCommunity} alt="" />
        <span>커뮤니티</span>
      </button>
      <button type="button" onClick={onOpenGroupbuy}>
        <img src={figmaAssets.customerNavBuy} alt="" />
        <span>공동구매</span>
      </button>
      <button type="button" className="active" onClick={onOpenMyPage}>
        <img src={figmaAssets.customerNavMy} alt="" />
        <span>마이페이지</span>
      </button>
    </nav>
  );
}

function TermsSection({ section }) {
  return (
    <article className="terms-section">
      <h2>{section.title}</h2>
      {section.intro && <p>{section.intro}</p>}
      {section.body?.map((paragraph, index) => (
        <p key={section.title + "-paragraph-" + index}>{paragraph}</p>
      ))}
      {section.bullets && (
        <ul>
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.closing && <p>{section.closing}</p>}
    </article>
  );
}


function DocumentPage({
  title,
  icon,
  summaryTitle,
  summaryMeta,
  lead,
  sections,
  onBack,
  onOpenMap,
  onOpenCommunity,
  onOpenGroupbuy,
  onOpenMyPage,
  confirmLabel,
}) {
  const [agreed, setAgreed] = useState(true);

  return (
    <section className="phone-page customer-page terms-page">
      <header className="customer-header terms-header">
        <div className="customer-gnb">
          <button type="button" className="customer-back" onClick={onBack} aria-label="뒤로가기">
            <img src={figmaAssets.customerBack} alt="" />
          </button>
          <h1>{title}</h1>
          <span className="terms-header-spacer" aria-hidden="true" />
        </div>
      </header>

      <section className="terms-summary-card">
        <span className="terms-summary-icon"><img src={icon} alt="" /></span>
        <div>
          <strong>{summaryTitle}</strong>
          <p>{summaryMeta}</p>
        </div>
        <img className="terms-summary-character" src={figmaAssets.customerReadCharacter} alt="기특이" />
      </section>

      <p className="terms-lead">{lead}</p>

      <section className="terms-content-card" aria-label={summaryTitle}>
        {sections.map((section) => (
          <TermsSection key={section.title} section={section} />
        ))}
      </section>

      <section className="terms-confirm-bar">
        <label>
          <input type="checkbox" checked={agreed} onChange={() => setAgreed((value) => !value)} />
          <span aria-hidden="true">✓</span>
          {confirmLabel}
        </label>
        <button type="button" disabled={!agreed} onClick={onBack}>확인</button>
      </section>

      <CustomerNav
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onOpenMyPage}
      />
    </section>
  );
}

function InquiryPage({ onBack, onOpenMap, onOpenCommunity, onOpenGroupbuy, onOpenMyPage }) {
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1500);
  };

  return (
    <section className="phone-page customer-page terms-page inquiry-page">
      <header className="customer-header terms-header">
        <div className="customer-gnb">
          <button type="button" className="customer-back" onClick={onBack} aria-label="뒤로가기">
            <img src={figmaAssets.customerBack} alt="" />
          </button>
          <h1>문의하기</h1>
          <span className="terms-header-spacer" aria-hidden="true" />
        </div>
      </header>

      <section className="terms-summary-card inquiry-summary-card">
        <span className="terms-summary-icon"><img src={figmaAssets.customerInquiry} alt="" /></span>
        <div>
          <strong>무엇을 도와드릴까요?</strong>
          <p>운영시간 내 순차적으로 확인해요</p>
        </div>
        <img className="terms-summary-character" src={figmaAssets.customerQuestionCharacter} alt="기특이" />
      </section>

      <section className="inquiry-guide-card">
        <div>
          <strong>답변 가능 시간</strong>
          <p>평일 AM 09:00 ~ PM 18:00</p>
        </div>
        <span>주말·공휴일 휴무</span>
      </section>

      <form
        className="inquiry-form-card"
        onSubmit={(event) => {
          event.preventDefault();
          showToast("문의가 임시 접수되었어요");
        }}
      >
        <label>
          <span>문의 유형</span>
          <select defaultValue="service">
            <option value="service">서비스 이용</option>
            <option value="place">장소 정보</option>
            <option value="account">계정/로그인</option>
            <option value="etc">기타</option>
          </select>
        </label>
        <label>
          <span>이메일</span>
          <input type="email" placeholder="답변 받을 이메일을 입력해주세요" />
        </label>
        <label>
          <span>문의 내용</span>
          <textarea placeholder="궁금한 점을 자세히 적어주세요" />
        </label>
        <button type="submit">문의 접수</button>
      </form>

      <CustomerNav
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onOpenMyPage}
      />
      {toast && <div className="inquiry-toast">{toast}</div>}
    </section>
  );
}

function TermsPage({ onBack, onOpenMap, onOpenCommunity, onOpenGroupbuy, onOpenMyPage }) {
  return (
    <DocumentPage
      title="이용약관"
      icon={figmaAssets.customerDoc}
      summaryTitle="기특기특 서비스 이용약관"
      summaryMeta="최종 업데이트: 2025.06.30"
      lead={<>기특기특 서비스를 이용하시기 전에<br />이용약관을 반드시 확인해주세요.</>}
      sections={termsSections}
      confirmLabel="이용약관에 동의합니다."
      onBack={onBack}
      onOpenMap={onOpenMap}
      onOpenCommunity={onOpenCommunity}
      onOpenGroupbuy={onOpenGroupbuy}
      onOpenMyPage={onOpenMyPage}
    />
  );
}

function PrivacyPage({ onBack, onOpenMap, onOpenCommunity, onOpenGroupbuy, onOpenMyPage }) {
  return (
    <DocumentPage
      title="개인정보 처리방침"
      icon={figmaAssets.customerLock}
      summaryTitle="개인정보 처리방침"
      summaryMeta="최종 업데이트: 2025.06.30"
      lead={<>기특기특은 필요한 정보만 수집하고<br />안전하게 보호합니다.</>}
      sections={privacySections}
      confirmLabel="처리방침을 확인했습니다."
      onBack={onBack}
      onOpenMap={onOpenMap}
      onOpenCommunity={onOpenCommunity}
      onOpenGroupbuy={onOpenGroupbuy}
      onOpenMyPage={onOpenMyPage}
    />
  );
}

export default function CustomerCenter({ onBack, onOpenMap, onOpenCommunity, onOpenGroupbuy, onOpenAuth }) {
  const [view, setView] = useState("home");

  if (view === "inquiry") {
    return (
      <InquiryPage
        onBack={() => setView("home")}
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onBack}
      />
    );
  }

  if (view === "terms") {
    return (
      <TermsPage
        onBack={() => setView("home")}
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onBack}
      />
    );
  }

  if (view === "privacy") {
    return (
      <PrivacyPage
        onBack={() => setView("home")}
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onBack}
      />
    );
  }

  return (
    <section className="phone-page customer-page">
      <header className="customer-header">
        <div className="customer-gnb">
          <button type="button" className="customer-back" onClick={onBack} aria-label="뒤로가기">
            <img src={figmaAssets.customerBack} alt="" />
          </button>
          <h1>고객센터</h1>
          <div className="customer-actions">
            <CustomerHeaderAction src={figmaAssets.signUpIcon} label="소셜 로그인" action="login_social" onClick={() => onOpenAuth?.("login")} />
            <CustomerHeaderAction src={figmaAssets.loginIcon} label="아이디 로그인" action="login_email" onClick={() => onOpenAuth?.("id-login")} />
          </div>
        </div>
        <div className="customer-title">
          <strong>궁금한 점이 있으신가요?</strong>
          <p>빠르게 도움을 받아보세요</p>
        </div>
      </header>

      <section className="customer-menu-card">
        <CustomerRow icon={figmaAssets.customerInquiry} title="문의하기" copy="궁금한 점을 문의해보세요" onClick={() => setView("inquiry")} />
        <CustomerRow icon={figmaAssets.customerDoc} title="이용약관" copy="서비스 이용 약관을 확인해보세요" onClick={() => setView("terms")} />
        <CustomerRow icon={figmaAssets.customerLock} title="개인정보 처리방침" copy="개인정보 처리 방침을 확인해보세요" onClick={() => setView("privacy")} />
      </section>

      <section className="customer-hours-card">
        <div className="customer-hours-copy">
          <span><img src={figmaAssets.customerStopwatch} alt="" /></span>
          <div>
            <strong>운영시간</strong>
            <p>주말 및 공휴일은 휴무입니다</p>
          </div>
        </div>
        <b>AM 09:00 ~ PM 18:00</b>
        <img className="customer-character" src={figmaAssets.customerCharacter} alt="기특이" />
      </section>

      <section className="customer-version-card">
        <div>
          <img src={figmaAssets.customerInfo} alt="" />
          <strong>버전정보</strong>
        </div>
        <span>v.1.0.0</span>
      </section>

      <CustomerNav
        onOpenMap={onOpenMap}
        onOpenCommunity={onOpenCommunity}
        onOpenGroupbuy={onOpenGroupbuy}
        onOpenMyPage={onBack}
      />
    </section>
  );
}
