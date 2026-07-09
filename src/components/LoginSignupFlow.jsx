import React, { useEffect, useState } from "react";
import { figmaAssets } from "../data/figmaAssets.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function Header({ title, onBack, centered = false }) {
  return (
    <header className="auth-header">
      <div className={centered ? "auth-header-inner centered" : "auth-header-inner"}>
        {onBack && (
          <button id="btn-auth-header-back" type="button" className="auth-back-button" data-event="click_back" data-page="auth" data-section="header" data-action="back" data-label="auth_back" onClick={onBack} aria-label="뒤로 가기">
            <img src={figmaAssets.authBack} alt="" />
          </button>
        )}
        <h1>{title}</h1>
      </div>
    </header>
  );
}

function AuthLogo({ compact = false }) {
  return (
    <div className={compact ? "auth-logo compact" : "auth-logo"}>
      <img src={figmaAssets.authTextLogo} alt="기특기특" />
      <p>
        오늘 하루도 <strong>기특하게!</strong>
      </p>
    </div>
  );
}

function LoginScreen({ onBack, onGoogleLogin, onKakaoLogin, onIdLogin, onSignUp }) {
  return (
    <section className="phone-page auth-login-page" aria-label="로그인">
      <button id="btn-auth-login-back" type="button" className="auth-login-back" data-event="click_back" data-page="auth" data-section="login" data-action="back" data-label="login_back" onClick={onBack} aria-label="뒤로가기">
        <img src={figmaAssets.customerBack} alt="" />
      </button>
      <img className="auth-login-bg" src={figmaAssets.authBg} alt="" />
      <img className="auth-login-logo-top" src={figmaAssets.authLogoTop} alt="" />
      <img className="auth-login-logo-bottom" src={figmaAssets.authLogoBottom} alt="기특기특" />
      <p className="auth-login-slogan">
        <span>기특한 </span>
        <span className="auth-login-slogan-muted">가격</span>
        <span> 기특한 </span>
        <span className="auth-login-slogan-muted">소비</span>
      </p>
      <div className="auth-login-ground" aria-hidden="true" />
      <div className="auth-login-character-shadow" aria-hidden="true" />
      <img className="auth-login-character" src={figmaAssets.authCharacter} alt="기특이 캐릭터" />

      <div className="auth-login-actions">
        <button id="btn-auth-login-kakao" type="button" className="auth-social-button" data-event="click_login_kakao" data-page="auth" data-section="login_options" data-action="login_kakao" data-label="kakao" onClick={onKakaoLogin}>
          <img src={figmaAssets.authKakao} alt="" />
          카카오톡으로 시작하기
        </button>
        <button id="btn-auth-login-google" type="button" className="auth-social-button" data-event="click_login_google" data-page="auth" data-section="login_options" data-action="login_google" data-label="google" onClick={onGoogleLogin}>
          <img src={figmaAssets.authGoogle} alt="" />
          구글로 시작하기
        </button>
        <button id="btn-auth-login-email_open" type="button" className="auth-social-button" data-event="click_login_email_open" data-page="auth" data-section="login_options" data-action="login_email_open" data-label="email" onClick={onIdLogin}>
          <img src={figmaAssets.authLoginIcon} alt="" />
          아이디로 로그인
        </button>
        <button id="btn-auth-login-signup_open" type="button" className="auth-signup-link" data-event="click_signup_open" data-page="auth" data-section="login_options" data-action="signup_open" data-label="signup" onClick={onSignUp}>
          회원가입
          <img src={figmaAssets.authChevron} alt="" />
        </button>
      </div>
    </section>
  );
}

function SignUpScreen({ onBack, onComplete, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "" });

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <section className="phone-page auth-form-page" aria-label="회원가입">
      <Header title="회원가입" onBack={onBack} />
      <form
        className="auth-form-panel auth-signup-panel"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete(form);
        }}
      >
        <AuthLogo compact />

        <div className="auth-fields">
          <label>
            <span>이메일</span>
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="이메일을 입력하세요"
            />
          </label>
          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={form.password}
              onChange={updateField("password")}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              minLength={6}
            />
          </label>
          <label>
            <span>비밀번호 확인</span>
            <input
              type="password"
              value={form.passwordConfirm}
              onChange={updateField("passwordConfirm")}
              placeholder="비밀번호를 다시 입력하세요"
              minLength={6}
            />
          </label>
        </div>

        <button id="btn-auth-signup-submit" type="submit" className="auth-primary-button" data-event="click_signup_submit" data-page="auth" data-section="signup_form" data-action="signup_submit" data-label="email_signup">회원가입</button>

        <button id="btn-auth-signup-login_open" type="button" className="auth-inline-login" data-event="click_login_open" data-page="auth" data-section="signup_form" data-action="login_open" data-label="login" onClick={onLogin}>
          <span>이미 계정이 있으신가요?</span>
          <strong>로그인</strong>
        </button>
      </form>
    </section>
  );
}

function CompleteScreen({ onHome, onMyPage }) {
  return (
    <section className="phone-page auth-form-page" aria-label="회원가입 완료">
      <Header title="회원가입 완료" centered />
      <div className="auth-complete-panel">
        <img className="auth-complete-image" src={figmaAssets.authComplete} alt="" />
        <div className="auth-complete-copy">
          <h2>
            회원가입이
            <br />
            <strong>완료</strong> 되었습니다!
          </h2>
          <p>
            기특기특과 함께
            <br />
            똑똑한 절약 생활을 시작해볼까요?
          </p>
        </div>
        <div className="auth-complete-actions">
          <button id="btn-auth-complete-home" type="button" className="auth-primary-button" data-event="click_home" data-page="auth" data-section="complete" data-action="home" data-label="home" onClick={onHome}>홈으로 가기</button>
          <button id="btn-auth-complete-mypage" type="button" className="auth-secondary-button" data-event="click_mypage" data-page="auth" data-section="complete" data-action="mypage" data-label="mypage" onClick={onMyPage}>마이페이지 바로 가기</button>
        </div>
      </div>
    </section>
  );
}

function IdLoginScreen({ onBack, onLogin, onSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <section className="phone-page auth-form-page" aria-label="아이디 로그인">
      <Header title="로그인" onBack={onBack} />
      <form
        className="auth-form-panel auth-id-panel"
        onSubmit={(event) => {
          event.preventDefault();
          onLogin(form);
        }}
      >
        <AuthLogo compact />
        <div className="auth-fields">
          <label>
            <span>이메일</span>
            <input type="email" value={form.email} onChange={updateField("email")} placeholder="이메일을 입력하세요" />
          </label>
          <label>
            <span>비밀번호</span>
            <input type="password" value={form.password} onChange={updateField("password")} placeholder="비밀번호를 입력하세요" />
          </label>
        </div>
        <button id="btn-auth-email_login-submit" type="submit" className="auth-primary-button" data-event="click_login_submit" data-page="auth" data-section="email_login_form" data-action="login_submit" data-label="email_login">로그인</button>
        <button id="btn-auth-email_login-signup_open" type="button" className="auth-inline-login" data-event="click_signup_open" data-page="auth" data-section="email_login_form" data-action="signup_open" data-label="signup" onClick={onSignUp}>
          <span>아직 계정이 없으신가요?</span>
          <strong>회원가입</strong>
        </button>
      </form>
    </section>
  );
}

export default function LoginSignupFlow({ initialStep = "login", onStepChange, onAuthenticated, onSkipToMap, onOpenMyPage, onBack }) {
  const { signInWithGoogle, signInWithKakao, signInWithEmail, signUpWithEmail } = useAuth();
  const [step, setStep] = useState(initialStep);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1500);
  };

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  const getAuthErrorMessage = (error, fallback) => {
    if (error?.message === "EMAIL_CONFIRMATION_REQUIRED") {
      return "이메일 확인이 켜져 있어요. Supabase에서 Confirm email을 끄거나, 메일 인증 후 로그인해주세요.";
    }

    const message = String(error?.message || "");
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "이메일 또는 비밀번호가 맞지 않아요.";
    }
    if (message.toLowerCase().includes("already registered")) {
      return "이미 가입된 이메일이에요. 로그인으로 들어가주세요.";
    }

    return message || fallback;
  };

  const showComplete = () => {
    setStep("complete");
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google 로그인 실패", error);
      showToast(error.message || "Google 로그인을 시작하지 못했어요");
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      console.error("Kakao 로그인 실패", error);
      showToast(error.message || "Kakao 로그인을 시작하지 못했어요");
    }
  };

  const handleEmailLogin = async (form) => {
    try {
      await signInWithEmail(form);
      onAuthenticated?.();
      showComplete();
    } catch (error) {
      console.error("이메일 로그인 실패", error);
      showToast(getAuthErrorMessage(error, "로그인하지 못했어요"));
    }
  };

  const handleEmailSignUp = async (form) => {
    if (!form.email || !form.password || form.password !== form.passwordConfirm) {
      showToast("이메일과 비밀번호를 확인해주세요");
      return;
    }

    if (form.password.length < 6) {
      showToast("비밀번호는 6자리 이상 입력해주세요");
      return;
    }

    try {
      await signUpWithEmail(form);
      onAuthenticated?.();
      showComplete();
    } catch (error) {
      console.error("이메일 회원가입 실패", error);
      const rawMessage = String(error.message || "").toLowerCase();
      const message = rawMessage.includes("password")
        ? "비밀번호는 6자리 이상 입력해주세요"
        : getAuthErrorMessage(error, "회원가입하지 못했어요");
      showToast(message);
    }
  };

  return (
    <>
      {step === "login" && (
        <LoginScreen
          onBack={onBack}
          onGoogleLogin={handleGoogleLogin}
          onKakaoLogin={handleKakaoLogin}
          onIdLogin={() => setStep("id-login")}
          onSignUp={() => setStep("signup")}
        />
      )}
      {step === "signup" && (
        <SignUpScreen
          onBack={() => setStep("login")}
          onComplete={handleEmailSignUp}
          onLogin={() => setStep("login")}
        />
      )}
      {step === "complete" && <CompleteScreen onHome={onSkipToMap} onMyPage={onOpenMyPage} />}
      {step === "id-login" && (
        <IdLoginScreen
          onBack={() => setStep("login")}
          onLogin={handleEmailLogin}
          onSignUp={() => setStep("signup")}
        />
      )}
      {toast && <div className="auth-toast">{toast}</div>}
    </>
  );
}
