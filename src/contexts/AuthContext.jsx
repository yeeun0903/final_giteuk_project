import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, supabaseEnabled, supabaseWritesEnabled } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);
const nicknameWords = ["체리", "다람쥐", "체리토마토", "복숭아", "라임", "두부", "모찌", "구름", "햇살"];

function createRandomNickname() {
  const index = Math.floor(Math.random() * nicknameWords.length);
  return `기특한 ${nicknameWords[index]}`;
}

function getOAuthNickname(user) {
  const metadata = user?.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.nickname ||
    metadata.preferred_username ||
    metadata.user_name ||
    user?.email?.split("@")[0] ||
    "사용자";
  return `기특한 ${String(name).trim()}`;
}

function getStoredProfile(userId) {
  if (!userId) return null;
  try {
    return JSON.parse(window.localStorage.getItem(`gtgt-auth-profile:${userId}`) || "null");
  } catch {
    return null;
  }
}

function saveStoredProfile(userId, profile) {
  if (!userId) return;
  window.localStorage.setItem(`gtgt-auth-profile:${userId}`, JSON.stringify(profile));
}

function isEmailConfirmationError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return message.includes("email not confirmed") || message.includes("not confirmed") || message.includes("confirm");
}

function getUserPhotoUrl(user) {
  const metadata = user?.user_metadata || {};
  return metadata.avatar_url || metadata.picture || null;
}

function createProfileFromUser(user) {
  if (!user) return { nickname: "게스트", provider: "guest" };
  const provider = user.app_metadata?.provider || user.identities?.[0]?.provider || "email";
  const storedProfile = getStoredProfile(user.id);
  const photoUrl = getUserPhotoUrl(user);

  if (storedProfile?.nickname) {
    const profile = {
      ...storedProfile,
      provider,
      photoUrl,
    };
    saveStoredProfile(user.id, profile);
    return profile;
  }

  const nickname = ["google", "kakao"].includes(provider) ? getOAuthNickname(user) : createRandomNickname();
  const profile = {
    nickname,
    provider,
    level: 1,
    photoUrl,
  };
  saveStoredProfile(user.id, profile);
  return profile;
}

async function ensureProfile(user) {
  if (!user || !supabaseWritesEnabled) return;

  const profile = createProfileFromUser(user);
  const photoUrl = getUserPhotoUrl(user);

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        nickname: profile.nickname,
        photo_url: photoUrl
      },
      { onConflict: "id" }
    );

  if (error) throw error;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ nickname: "게스트", provider: "guest", level: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shouldForceLogout = new URLSearchParams(window.location.search).get("logout") === "1";

    if (shouldForceLogout) {
      window.localStorage.removeItem("gtgt-google-oauth-pending");
      window.localStorage.removeItem("gtgt-auth-entry-source");
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (!supabaseEnabled) {
      setSession(null);
      setUser(null);
      setProfile({ nickname: "게스트", provider: "guest", level: 0 });
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    if (shouldForceLogout) {
      supabase.auth.signOut().finally(() => {
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setProfile({ nickname: "게스트", provider: "guest", level: 0 });
        setLoading(false);
      });
    } else {
      supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user || null);
      setProfile(data.session?.user ? createProfileFromUser(data.session.user) : { nickname: "게스트", provider: "guest", level: 0 });

      if (data.session?.user) {
        try {
          await ensureProfile(data.session.user);
        } catch (profileError) {
          // eslint-disable-next-line no-console
          console.error("프로필 생성 실패", profileError);
        }
      }

      setLoading(false);
      });
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setProfile(nextSession?.user ? createProfileFromUser(nextSession.user) : { nickname: "게스트", provider: "guest", level: 0 });

      if (nextSession?.user) {
        try {
          await ensureProfile(nextSession.user);
        } catch (profileError) {
          // eslint-disable-next-line no-console
          console.error("프로필 생성 실패", profileError);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOAuthProvider = async (provider) => {
    if (!supabaseEnabled) {
      throw new Error("Supabase 설정을 확인해주세요. 로그인 연결을 시작하지 못했어요.");
    }

    window.localStorage.setItem("gtgt-oauth-pending", "1");
    window.localStorage.setItem("gtgt-oauth-provider", provider);

    const options = {
      redirectTo: window.location.origin
    };

    if (provider === "kakao") {
      options.scopes = "profile_nickname";
      options.queryParams = {
        scope: "profile_nickname"
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options
    });

    if (error) throw error;
  };

  const signInWithGoogle = () => signInWithOAuthProvider("google");

  const signInWithKakao = () => signInWithOAuthProvider("kakao");

  const signInWithEmail = async ({ email, password }) => {
    if (!supabaseEnabled) {
      throw new Error("Supabase 설정을 확인해주세요. 로그인 연결을 시작하지 못했어요.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (isEmailConfirmationError(error)) {
        throw new Error("EMAIL_CONFIRMATION_REQUIRED");
      }
      throw error;
    }
    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      setProfile(createProfileFromUser(data.session.user));
    } else if (data.user) {
      setUser(data.user);
      setProfile(createProfileFromUser(data.user));
    }
    return data;
  };

  const signUpWithEmail = async ({ email, password }) => {
    if (!supabaseEnabled) {
      throw new Error("Supabase 설정을 확인해주세요. 회원가입을 시작하지 못했어요.");
    }

    const nickname = createRandomNickname();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    if (data.user) {
      saveStoredProfile(data.user.id, { nickname, provider: "email", level: 1 });
      setProfile(createProfileFromUser(data.user));
    }

    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      return data;
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      if (isEmailConfirmationError(loginError)) {
        throw new Error("EMAIL_CONFIRMATION_REQUIRED");
      }
      throw loginError;
    }

    if (loginData.session?.user) {
      saveStoredProfile(loginData.session.user.id, { nickname, provider: "email", level: 1 });
      setSession(loginData.session);
      setUser(loginData.session.user);
      setProfile(createProfileFromUser(loginData.session.user));
    }

    return loginData;
  };

  const signOut = async () => {
    if (!supabaseEnabled) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      nickname: profile.nickname,
      isAuthenticated: Boolean(user),
      loading,
      signInWithGoogle,
      signInWithKakao,
      signInWithEmail,
      signUpWithEmail,
      signOut
    }),
    [loading, profile, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  return context;
}
