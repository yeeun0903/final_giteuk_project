import React, { useEffect, useMemo, useState } from "react";
import MyPage from "./components/MyPage.jsx";
import CharacterCustomizePage from "./components/CharacterCustomizePage.jsx";
import CommunityMain from "./components/CommunityMain.jsx";
import CommunityPostPdp from "./components/CommunityPostPdp.jsx";
import CommunityPosting from "./components/CommunityPosting.jsx";
import CommunityPostDetailLayout from "./components/community/CommunityPostDetailLayout.jsx";
import CustomerCenter from "./components/CustomerCenter.jsx";
import GroupBuyMain from "./pages/GroupBuy_Main.jsx";
import GroupBuyProductDetail01 from "./pages/GroupBuy_Product_Detail_01.jsx";
import GroupBuyProductDetail02 from "./pages/GroupBuy_Product_Detail_02.jsx";
import GroupBuyProductDetail03 from "./pages/GroupBuy_Product_Detail_03.jsx";
import GroupBuyProductDetail04 from "./pages/GroupBuy_Product_Detail_04.jsx";
import GroupBuyProductDetail05 from "./pages/GroupBuy_Product_Detail_05.jsx";
import GroupBuyProductDetail06 from "./pages/GroupBuy_Product_Detail_06.jsx";
import GroupBuyProductDetail07 from "./pages/GroupBuy_Product_Detail_07.jsx";
import GroupBuyProductDetail08 from "./pages/GroupBuy_Product_Detail_08.jsx";
import GroupBuyProductDetail09 from "./pages/GroupBuy_Product_Detail_09.jsx";
import PaymentCompleted from "./pages/Payment_completed.jsx";
import CommunityConveniencePdpAll from "./pages/CommunityConveniencePdpAll.jsx";
import CommunityConveniencePdpOnePlusOne from "./pages/CommunityConveniencePdpOnePlusOne.jsx";
import CommunityConveniencePdpTwoPlusOne from "./pages/CommunityConveniencePdpTwoPlusOne.jsx";
import CommunityConveniencePdpThreePlusOne from "./pages/CommunityConveniencePdpThreePlusOne.jsx";
import CommunityPostSale from "./pages/Community_post_sale.jsx";
import CommunityPostSale2 from "./pages/Community_post_sale2.jsx";
import CommunityPostReport from "./pages/Community_post_report.jsx";
import InformNewPlacePage from "./components/InformNewPlacePage.jsx";
import LoginSignupFlow from "./components/LoginSignupFlow.jsx";
import MapMainPage from "./components/MapMainPage.jsx";
import SplashPage from "./components/SplashPage.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { initializeAnalytics, trackClick, trackPageView } from "./lib/analytics.js";
import { installGtmClickIds } from "./utils/gtmClickIds.js";
import { groupbuyProducts } from "./data/groupbuyMainData.js";
import { getSavedFavoriteIds } from "./utils/groupbuyFavorites.js";
import {
  createAuthEvent,
  createCommunityPost as createCommunityPostRecord,
  createGroupbuyEvent,
  createVisit,
  deleteCommunityPost,
  getSavingStats,
  listCommunityPosts,
  removeGroupbuyFavorite,
  removePlaceFavorite,
  updateCommunityPost,
  upsertGroupbuyFavorite,
  upsertPlaceFavorite,
} from "./lib/database.js";
import { supabaseEnabled } from "./lib/supabaseClient.js";
import pdpBackIcon from "./assets/Community_post_pdp/Back icon.png";
import pdpWriterCharacter from "./assets/Community_post_pdp/006_giteuk_clothes2_hat_none_none.png";
import pdpThumbUpIcon from "./assets/Community_post_pdp/Button_ThumbUp.png";
import pdpCommentThumbIcon from "./assets/Community_post_pdp/Button_ThumbUp-1.png";
import pdpFavouriteIcon from "./assets/Community_post_pdp/favourite.png";
import pdpShareIcon from "./assets/Community_post_pdp/Button_Share.png";
import pdpCommentIcon from "./assets/Community_post_pdp/Button_WriteComment.png";
import pdpSortIcon from "./assets/Community_post_pdp/chevron-down.png";

const communityCategoryMeta = {
  이용후기: {
    badgeTone: "primary",
    location: "강남",
    detailPageClassName: "",
  },
  할인정보: {
    badgeTone: "soft",
    location: "전국",
    detailPageClassName: "pdp-frame-user-sale",
  },
  제보하기: {
    badgeTone: "mint",
    location: "역삼동",
    detailPageClassName: "pdp-frame-user-report",
  },
};

const initialCommunityPosts = [
  {
    id: 1,
    reportPage: true,
    badge: "제보하기",
    badgeTone: "mint",
    title: "역삼역 포차 소주 2000원",
    body: "포차에서 소주 2천원. 안주도 가성비 좋고 회사 사람들이랑 부담없이 한잔하러 가기 좋아요.",
    location: "역삼동",
    time: "1시간 전",
    likes: 21,
    photoVariant: "bottle",
  },
  {
    id: 2,
    detailPage: true,
    badge: "이용후기",
    badgeTone: "primary",
    title: "강남 점심 제육 만원인데 양 많고 쌈도 줘요",
    body: "요즘 점심 제대로 먹으려면 1.3~1.5인데 제육에 야채도 많고 쌈까지 주는곳 만원이네요. 맛있는데 가성비까지 최고",
    location: "강남",
    time: "2시간 전",
    likes: 25,
    photoVariant: "meal",
  },
  {
    id: 3,
    salePage: true,
    badge: "할인정보",
    badgeTone: "soft",
    title: "CU 무료 배달+2천원 할인쿠폰 이벤트",
    body: "CU 유저분들, CU 배달 생기고 프로모션 하네요. 배달비 원래 3천원인데 무료고 할인 쿠폰도 줘요.",
    location: "전국",
    time: "2시간 전",
    likes: 60,
    photoVariant: "discount",
  },
  {
    id: 4,
    sojuSalePage: true,
    badge: "할인정보",
    badgeTone: "soft",
    title: "강남 소주 2,000원 실화인가요?",
    body: "역삼 포차 소주 2천원. 안주도 가성비 좋고 회사 사람들이랑 부담없이 한잔하기 좋아요.",
    location: "역삼동",
    time: "1시간 전",
    likes: 100,
    photoVariant: "soju",
  },
];

const detailPageProductIds = {
  groupbuy_product_detail_01: "detergent",
  groupbuy_product_detail_02: "sun-bb",
  groupbuy_product_detail_03: "ice-cream",
  groupbuy_product_detail_04: "glasses",
  groupbuy_product_detail_05: "tissue",
  groupbuy_product_detail_06: "nike",
  groupbuy_product_detail_07: "rice",
  groupbuy_product_detail_08: "kanu",
  groupbuy_product_detail_09: "shampoo",
};

const pageLabels = {
  splash: "splash",
  course: "map",
  auth: "auth",
  inform: "inform",
  community: "community",
  "community-posting": "community_posting",
  groupbuy: "groupbuy",
  mypage: "mypage",
  customer: "customer",
  customize: "customize",
};

export default function App() {
  const { user, loading, isAuthenticated, nickname, signOut } = useAuth();
  const [page, setPage] = useState("splash");
  const [openSongpaAfterAuth, setOpenSongpaAfterAuth] = useState(false);
  const [authInitialStep, setAuthInitialStep] = useState("login");
  const [authReturnPage, setAuthReturnPage] = useState("course");
  const [authEntrySource, setAuthEntrySource] = useState("default");
  const [memberPopupSeen, setMemberPopupSeen] = useState(false);
  const [totalSaving, setTotalSaving] = useState(0);
  const [monthlySaving, setMonthlySaving] = useState(0);
  const [visitRecords, setVisitRecords] = useState([]);
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [groupbuyFavoriteIds, setGroupbuyFavoriteIds] = useState(getSavedFavoriteIds);
  const [groupbuyPurchaseRecords, setGroupbuyPurchaseRecords] = useState([]);
  const [communityPage, setCommunityPage] = useState("main");
  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const [communityActiveTab, setCommunityActiveTab] = useState("전체");
  const [selectedCommunityUserPost, setSelectedCommunityUserPost] = useState(null);
  const [isCommunityPostingOpen, setIsCommunityPostingOpen] = useState(false);
  const [mapTargetPlace, setMapTargetPlace] = useState(null);
  const [groupbuyPage, setGroupbuyPage] = useState("main");
  const [isPaymentCompletedOpen, setIsPaymentCompletedOpen] = useState(false);

  const paymentProduct = useMemo(() => {
    const productId = detailPageProductIds[groupbuyPage];
    return groupbuyProducts.find((product) => product.id === productId);
  }, [groupbuyPage]);

  const likedGroupbuyProducts = useMemo(
    () => groupbuyProducts.filter((product) => groupbuyFavoriteIds.includes(product.id)),
    [groupbuyFavoriteIds],
  );

  const monthlyGroupbuyPurchaseRecords = useMemo(() => {
    const now = new Date();
    return groupbuyPurchaseRecords.filter((record) => {
      const purchasedDate = new Date(record.purchased_at);
      return (
        !Number.isNaN(purchasedDate.getTime()) &&
        purchasedDate.getFullYear() === now.getFullYear() &&
        purchasedDate.getMonth() === now.getMonth()
      );
    });
  }, [groupbuyPurchaseRecords]);

  useEffect(() => {
    const updatePrototypeScale = () => {
      const viewportWidth = window.visualViewport?.width || window.innerWidth;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const availableHeight = Math.max(1, viewportHeight - 6);
      const nextScale = Math.min(viewportWidth / 402, availableHeight / 874, 1);
      document.documentElement.style.setProperty("--prototype-viewport-width", String(viewportWidth) + "px");
      document.documentElement.style.setProperty("--prototype-viewport-height", String(viewportHeight) + "px");
      document.documentElement.style.setProperty("--prototype-scale", String(Math.max(0.1, nextScale)));
    };

    updatePrototypeScale();
    window.addEventListener("resize", updatePrototypeScale);
    window.addEventListener("orientationchange", updatePrototypeScale);
    window.visualViewport?.addEventListener("resize", updatePrototypeScale);

    return () => {
      window.removeEventListener("resize", updatePrototypeScale);
      window.removeEventListener("orientationchange", updatePrototypeScale);
      window.visualViewport?.removeEventListener("resize", updatePrototypeScale);
    };
  }, []);

  useEffect(() => {
    if (page !== "splash") return undefined;
    const timer = window.setTimeout(() => setPage("course"), 3200);
    return () => window.clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => installGtmClickIds(page), [page]);

  useEffect(() => {
    trackPageView(page, pageLabels[page] || page);
  }, [page]);

  useEffect(() => {
    const handleTrackedClick = (event) => {
      const target = event.target.closest?.("button,a,[role='button'],input,select");
      if (!target?.id) return;
      trackClick({
        id: target.id,
        eventName: target.dataset.event || "gtgt_click",
        page: target.dataset.page || pageLabels[page] || page,
        pageId: page,
        section: target.dataset.section || "unknown",
        action: target.dataset.action || "click",
        label: target.dataset.label || target.dataset.action || target.id,
      });
    };

    document.addEventListener("click", handleTrackedClick);
    return () => document.removeEventListener("click", handleTrackedClick);
  }, [page]);


  useEffect(() => {
    const handleGroupbuyFavoritesChanged = (event) => {
      setGroupbuyFavoriteIds(Array.isArray(event.detail) ? event.detail : getSavedFavoriteIds());
    };

    window.addEventListener("groupbuy:favorites-changed", handleGroupbuyFavoritesChanged);
    return () => {
      window.removeEventListener("groupbuy:favorites-changed", handleGroupbuyFavoritesChanged);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    listCommunityPosts()
      .then((rows) => {
        if (cancelled || !rows.length) return;
        const savedPosts = rows.map((row) => mapDatabaseCommunityPost(row, nickname, user?.id));
        setCommunityPosts([...savedPosts, ...initialCommunityPosts]);
      })
      .catch((error) => console.error("커뮤니티 게시글 목록 불러오기 실패", error));

    return () => {
      cancelled = true;
    };
  }, [nickname, user?.id]);

  useEffect(() => {
    if (loading || !user?.id) return;
    const hasPendingOAuth =
      window.localStorage.getItem("gtgt-oauth-pending") === "1" ||
      window.localStorage.getItem("gtgt-google-oauth-pending") === "1";
    if (!hasPendingOAuth) return;

    const pendingSource = window.localStorage.getItem("gtgt-auth-entry-source") || "default";
    window.localStorage.removeItem("gtgt-google-oauth-pending");
    window.localStorage.removeItem("gtgt-oauth-pending");
    window.localStorage.removeItem("gtgt-oauth-provider");
    window.localStorage.removeItem("gtgt-auth-entry-source");
    setAuthEntrySource(pendingSource);
    setAuthInitialStep("complete");
    setPage("auth");
  }, [loading, user?.id]);

  const getPlaceKey = (place) => String(place?.place_id || place?.id || place?.place_name || "local-place");

  const openAuth = (step = "login", returnPage = page, source = "default") => {
    setAuthInitialStep(step);
    setAuthReturnPage(returnPage === "auth" ? "course" : returnPage);
    setAuthEntrySource(source);
    window.localStorage.setItem("gtgt-auth-entry-source", source);
    createAuthEvent({
      userId: user?.id,
      eventType: step === "signup" ? "open_signup" : "open_login",
      entrySource: source,
      returnPage,
    }).catch((error) => console.error("인증 진입 이벤트 저장 실패", error));
    setPage("auth");
  };

  const markMemberPopupSeen = () => {
    setMemberPopupSeen(true);
  };

  const openMapPage = () => {
    setIsCommunityPostingOpen(false);
    setMapTargetPlace(null);
    setPage("course");
  };
  const openMapPlace = (post) => {
    if (!post?.mapPlace) return;
    setIsCommunityPostingOpen(false);
    setMapTargetPlace(post.mapPlace);
    setPage("course");
  };
  const openCommunityPage = () => {
    setIsCommunityPostingOpen(false);
    setCommunityPage("main");
    setPage("community");
  };
  const openCommunityPostingPage = () => {
    if (!isAuthenticated) {
      openAuth("login", "community", "community-posting");
      return;
    }

    setIsCommunityPostingOpen(true);
    setPage("community-posting");
    setCommunityPage("posting");
  };
  const openGroupbuyPage = () => {
    setIsCommunityPostingOpen(false);
    setGroupbuyPage("main");
    setPage("groupbuy");
  };
  const openMyPage = () => {
    setIsCommunityPostingOpen(false);
    setPage("mypage");
  };

  const commonNavigationProps = {
    onOpenMap: openMapPage,
    onOpenCommunity: openCommunityPage,
    onOpenGroupbuy: openGroupbuyPage,
    onOpenMyPage: openMyPage,
    onOpenAuth: (step, returnPage = page, source = "default") => openAuth(step, returnPage, source),
    currentNickname: nickname,
    currentUserId: user?.id || null,
    isAuthenticated,
  };

  const handleSignOut = async () => {
    await signOut();
    setTotalSaving(0);
    setMonthlySaving(0);
    setVisitRecords([]);
    setLikedPlaces([]);
    setGroupbuyFavoriteIds([]);
    setGroupbuyPurchaseRecords([]);
    setPage("mypage");
  };

  const refreshSavingStats = async (userId) => {
    const stats = await getSavingStats(userId);
    setTotalSaving(stats.totalSaving);
    setMonthlySaving(stats.monthlySaving);
  };

  useEffect(() => {
    if (!supabaseEnabled) return;

    if (!user?.id) {
      setTotalSaving(0);
      setMonthlySaving(0);
      return;
    }

    refreshSavingStats(user.id).catch((error) => {
      console.error("절약 금액 조회 실패", error);
    });
  }, [user?.id]);

  const addLocalVisitRecord = ({ savingAmount, place }) => {
    const nextSaving = Math.max(0, Number(savingAmount) || 0);
    const visitedAt = new Date().toISOString();
    const record = {
      id: String(place.place_id || place.id || place.place_name || "local-place") + "-" + visitedAt,
      place_id: String(place.place_id || place.id || place.place_name || "local-place"),
      place_name: place.place_name || "이름 없는 가게",
      category: place.category || "기타",
      saving_amount: nextSaving,
      visited_at: visitedAt
    };

    setVisitRecords((records) => [record, ...records]);
    setTotalSaving((amount) => amount + nextSaving);
    setMonthlySaving((amount) => amount + nextSaving);

    return record;
  };

  const handleToggleLike = (place) => {
    const placeKey = getPlaceKey(place);
    const isLiked = likedPlaces.some((likedPlace) => getPlaceKey(likedPlace) === placeKey);

    setLikedPlaces((places) => {
      if (places.some((likedPlace) => getPlaceKey(likedPlace) === placeKey)) {
        return places.filter((likedPlace) => getPlaceKey(likedPlace) !== placeKey);
      }

      return [{ ...place, liked_at: new Date().toISOString() }, ...places];
    });

    if (user?.id) {
      const action = isLiked
        ? removePlaceFavorite({ userId: user.id, place })
        : upsertPlaceFavorite({ userId: user.id, place });
      action.catch((error) => console.error("업소 찜 저장 실패", error));
    }
  };

  const handleConfirmVisited = async ({ savingAmount, place }) => {
    const nextSaving = Math.max(0, Number(savingAmount) || 0);

    if (!user?.id) {
      openAuth("login", "course", "map-action");
      return;
    }

    try {
      const savedVisit = supabaseEnabled
        ? await createVisit({ userId: user.id, place, savingAmount: nextSaving })
        : null;
      addLocalVisitRecord({ savingAmount: savedVisit?.saving_amount ?? nextSaving, place });
      if (supabaseEnabled) await refreshSavingStats(user.id);
      setPage("mypage");
    } catch (error) {
      console.error("방문 기록 저장 실패", error);
    }
  };

  const handleShareGroupbuyProduct = async (product) => {
    if (!product) return;

    const shareData = {
      title: product.title,
      text: `${product.title} 공동구매를 확인해보세요.`,
      url: window.location.href,
    };

    try {
      if (user?.id) {
        createGroupbuyEvent({ userId: user.id, product, eventType: "share" })
          .catch((error) => console.error("공동구매 공유 이벤트 저장 실패", error));
      }

      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`);
      window.alert("공유 링크가 복사되었습니다.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("공동구매 공유 실패", error);
      }
    }
  };

  useEffect(() => {
    const handlePaymentButtonClick = (event) => {
      const buyButton = event.target.closest?.(".groupbuy-detail-buy-button");
      const shareButton = event.target.closest?.(".groupbuy-detail-share-button");

      if (shareButton) {
        event.preventDefault();
        handleShareGroupbuyProduct(paymentProduct);
        return;
      }

      if (!buyButton) return;

      event.preventDefault();
      if (!isAuthenticated) {
        openAuth("login", "groupbuy", "groupbuy-participate");
        return;
      }

      if (paymentProduct) {
        const purchasedAt = new Date().toISOString();
        if (user?.id) {
          createGroupbuyEvent({ userId: user.id, product: paymentProduct, eventType: "participate" })
            .catch((error) => console.error("공동구매 참여 이벤트 저장 실패", error));
        }
        setGroupbuyPurchaseRecords((records) => [
          {
            id: `${paymentProduct.id}-${purchasedAt}`,
            product_id: paymentProduct.id,
            title: paymentProduct.title,
            category: paymentProduct.category,
            image: paymentProduct.image,
            groupPrice: paymentProduct.groupPrice,
            discount: paymentProduct.discount,
            purchased_at: purchasedAt,
          },
          ...records,
        ]);
      }
      setIsPaymentCompletedOpen(true);
    };

    document.addEventListener("click", handlePaymentButtonClick);

    return () => {
      document.removeEventListener("click", handlePaymentButtonClick);
    };
  }, [isAuthenticated, paymentProduct, user?.id]);

  const handleGroupbuyFavoriteIdsChange = (nextIds) => {
    const normalizedNextIds = Array.isArray(nextIds) ? nextIds : [];
    const addedId = normalizedNextIds.find((id) => !groupbuyFavoriteIds.includes(id));
    const removedId = groupbuyFavoriteIds.find((id) => !normalizedNextIds.includes(id));
    const changedProduct = groupbuyProducts.find((product) => product.id === (addedId || removedId));

    setGroupbuyFavoriteIds(normalizedNextIds);

    if (!user?.id || !changedProduct) return;

    const action = addedId
      ? Promise.all([
          upsertGroupbuyFavorite({ userId: user.id, product: changedProduct }),
          createGroupbuyEvent({ userId: user.id, product: changedProduct, eventType: "favorite" }),
        ])
      : Promise.all([
          removeGroupbuyFavorite({ userId: user.id, productId: removedId }),
          createGroupbuyEvent({ userId: user.id, product: changedProduct, eventType: "unfavorite" }),
        ]);

    action.catch((error) => console.error("공동구매 찜 이벤트 저장 실패", error));
  };

  const handleCreateCommunityPost = async ({ category, title, body, photoUrl }) => {
    const nextCategory = category?.trim();
    const nextTitle = title.trim();
    const nextBody = body.trim();
    const meta = communityCategoryMeta[nextCategory];

    if (!meta || !nextTitle || !nextBody) return;

    const optimisticId = `local-user-${Date.now()}`;
    const optimisticPost = {
      id: optimisticId,
      userPage: true,
      badge: nextCategory,
      badgeTone: meta.badgeTone,
      detailPageClassName: meta.detailPageClassName,
      title: nextTitle,
      body: nextBody,
      authorName: nickname,
      location: meta.location,
      time: "방금 전",
      likes: 0,
      photoUrl,
      canManage: Boolean(user?.id),
    };

    setCommunityPosts((currentPosts) => [optimisticPost, ...currentPosts]);

    if (user?.id) {
      try {
        const savedPost = await createCommunityPostRecord({
          userId: user.id,
          title: nextTitle,
          content: nextBody,
          category: nextCategory,
          authorName: nickname,
          photoUrl,
        });

        if (savedPost) {
          setCommunityPosts((currentPosts) =>
            currentPosts.map((post) =>
              post.id === optimisticId ? mapDatabaseCommunityPost(savedPost, nickname, user.id) : post,
            ),
          );
        }
      } catch (error) {
        console.error("커뮤니티 게시글 저장 실패", error);
      }
    }

    setCommunityActiveTab(nextCategory);
    setIsCommunityPostingOpen(false);
    setCommunityPage("main");
    setPage("community");
  };

  const handleUpdateCommunityPost = async (postId, nextPost) => {
    const targetPost = communityPosts.find((post) => post.id === postId);
    if (!targetPost) return;

    setCommunityPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, ...nextPost } : post,
      ),
    );
    setSelectedCommunityUserPost((currentPost) =>
      currentPost?.id === postId ? { ...currentPost, ...nextPost } : currentPost,
    );

    if (user?.id && targetPost.dbId) {
      updateCommunityPost({
        userId: user.id,
        postId: targetPost.dbId,
        title: nextPost.title,
        content: nextPost.body,
      }).catch((error) => console.error("커뮤니티 게시글 수정 실패", error));
    }
  };

  const handleDeleteCommunityPost = async (postId) => {
    const targetPost = communityPosts.find((post) => post.id === postId);
    setCommunityPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setSelectedCommunityUserPost(null);
    setCommunityPage("main");

    if (user?.id && targetPost?.dbId) {
      deleteCommunityPost({ userId: user.id, postId: targetPost.dbId })
        .catch((error) => console.error("커뮤니티 게시글 삭제 실패", error));
    }
  };

  const handleOpenCommunityUserPost = (post) => {
    setSelectedCommunityUserPost(post);
    setCommunityPage("user-post-detail");
  };

  const handleOpenGroupbuyProductDetail = (product) => {
    const productPage = Object.entries(detailPageProductIds).find(
      ([, productId]) => productId === product.id,
    )?.[0];

    setGroupbuyPage(productPage || "groupbuy_product_detail_01");
  };

  const userPostDetail = selectedCommunityUserPost
    ? createUserPostDetail(selectedCommunityUserPost, nickname)
    : null;

  const renderCommunityPage = () => {
    if (communityPage === "post-pdp") {
      return (
        <CommunityPostPdp
          onBack={() => setCommunityPage("main")}
          onOpenMapPlace={openMapPlace}
          currentNickname={nickname}
          currentUserId={user?.id || null}
          isAuthenticated={isAuthenticated}
          {...commonNavigationProps}
        />
      );
    }

    if (communityPage === "user-post-detail" && userPostDetail) {
      return (
        <CommunityPostDetailLayout
          post={userPostDetail}
          onBack={() => setCommunityPage("main")}
          onOpenMapPlace={openMapPlace}
          currentNickname={nickname}
          currentUserId={user?.id || null}
          isAuthenticated={isAuthenticated}
          onUpdatePost={handleUpdateCommunityPost}
          onDeletePost={handleDeleteCommunityPost}
          {...commonNavigationProps}
        />
      );
    }

    if (communityPage === "Community_post_sale") {
      return <CommunityPostSale onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_post_sale2") {
      return <CommunityPostSale2 onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_post_report") {
      return <CommunityPostReport onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_convenience_pdp_all") {
      return <CommunityConveniencePdpAll onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_convenience_pdp_1plus1") {
      return <CommunityConveniencePdpOnePlusOne onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_convenience_pdp_2plus1") {
      return <CommunityConveniencePdpTwoPlusOne onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    if (communityPage === "Community_convenience_pdp_3plus1") {
      return <CommunityConveniencePdpThreePlusOne onBack={() => setCommunityPage("main")} {...commonNavigationProps} />;
    }

    return (
      <CommunityMain
        posts={communityPosts}
        activeTab={communityActiveTab}
        onTabChange={setCommunityActiveTab}
        onOpenPost={() => setCommunityPage("post-pdp")}
        onOpenSalePost={() => setCommunityPage("Community_post_sale")}
        onOpenSojuSalePost={() => setCommunityPage("Community_post_sale2")}
        onOpenReportPost={() => setCommunityPage("Community_post_report")}
        onOpenUserPost={handleOpenCommunityUserPost}
        onOpenPosting={openCommunityPostingPage}
          onOpenConveniencePdpAll={() => setCommunityPage("Community_convenience_pdp_all")}
          {...commonNavigationProps}
        />
    );
  };

  const renderGroupbuyPage = () => {
    let pageContent;

    if (groupbuyPage === "groupbuy_product_detail_01") {
      pageContent = <GroupBuyProductDetail01 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_02") {
      pageContent = <GroupBuyProductDetail02 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_03") {
      pageContent = <GroupBuyProductDetail03 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_04") {
      pageContent = <GroupBuyProductDetail04 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_05") {
      pageContent = <GroupBuyProductDetail05 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_06") {
      pageContent = <GroupBuyProductDetail06 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_07") {
      pageContent = <GroupBuyProductDetail07 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_08") {
      pageContent = <GroupBuyProductDetail08 onBack={() => setGroupbuyPage("main")} />;
    } else if (groupbuyPage === "groupbuy_product_detail_09") {
      pageContent = <GroupBuyProductDetail09 onBack={() => setGroupbuyPage("main")} />;
    } else {
      pageContent = (
        <GroupBuyMain
          onOpenProductDetail={handleOpenGroupbuyProductDetail}
          favoriteProductIds={groupbuyFavoriteIds}
          onFavoriteIdsChange={handleGroupbuyFavoriteIdsChange}
          {...commonNavigationProps}
        />
      );
    }

    return (
      <>
        {pageContent}
        <PaymentCompleted
          isOpen={isPaymentCompletedOpen}
          productName={paymentProduct?.title ?? "상품"}
          paymentAmount={paymentProduct?.groupPrice ?? "-"}
          onClose={() => setIsPaymentCompletedOpen(false)}
          onContinue={() => {
            setIsPaymentCompletedOpen(false);
            setGroupbuyPage("main");
          }}
          onHome={() => {
            setIsPaymentCompletedOpen(false);
            setGroupbuyPage("main");
            openMapPage();
          }}
        />
      </>
    );
  };

  return (
    <main id={`page-${page}`} className="app-shell" data-page-id={page} data-page-name={pageLabels[page] || page}>
      <span id="gtm-current-page-name" className="gtm-page-name-marker">
        {pageLabels[page] || page}
      </span>
      {page === "splash" && !loading && <SplashPage />}
      {page === "course" && (
        <MapMainPage
          initialSongpaOpen={openSongpaAfterAuth}
          targetPlace={mapTargetPlace}
          onTargetPlaceHandled={() => setMapTargetPlace(null)}
          showMemberPopupOnMount={!memberPopupSeen && !isAuthenticated}
          onMemberPopupSeen={markMemberPopupSeen}
          onOpenMyPage={openMyPage}
          onOpenCommunity={openCommunityPage}
          onOpenGroupbuy={openGroupbuyPage}
          onOpenInform={() => setPage("inform")}
          onOpenAuth={openAuth}
          onConfirmVisited={handleConfirmVisited}
          isAuthenticated={isAuthenticated}
          likedPlaces={likedPlaces}
          onToggleLike={handleToggleLike}
        />
      )}
      {page === "auth" && (
        <LoginSignupFlow
          initialStep={authInitialStep}
          onAuthenticated={() => {
            createAuthEvent({
              userId: user?.id,
              eventType: authInitialStep === "signup" ? "signup_complete" : "login_complete",
              entrySource: authEntrySource,
              returnPage: authReturnPage,
            }).catch((error) => console.error("인증 완료 이벤트 저장 실패", error));
            setAuthInitialStep("complete");
          }}
          onSkipToMap={() => {
            setOpenSongpaAfterAuth(authEntrySource === "songpa-popup");
            if (authEntrySource === "songpa-popup") markMemberPopupSeen();
            setPage("course");
          }}
          onOpenMyPage={() => {
            setOpenSongpaAfterAuth(false);
            setPage("mypage");
          }}
          onBack={() => setPage(authReturnPage)}
        />
      )}
      {page === "inform" && (
        <InformNewPlacePage
          onBack={() => setPage("course")}
          onOpenMap={openMapPage}
          onOpenCommunity={openCommunityPage}
          onOpenGroupbuy={openGroupbuyPage}
          onOpenMyPage={openMyPage}
          onOpenAuth={(step) => openAuth(step, "inform")}
        />
      )}
      {page === "community" && renderCommunityPage()}
      {page === "community-posting" && (
        <CommunityPosting
          onBack={() => {
            setIsCommunityPostingOpen(false);
            setCommunityPage("main");
            setPage("community");
          }}
          onSubmit={handleCreateCommunityPost}
          {...commonNavigationProps}
        />
      )}
      {page === "groupbuy" && renderGroupbuyPage()}
      {page === "mypage" && (
        <MyPage
          onOpenCustomize={() => setPage("customize")}
          onOpenCustomerCenter={() => setPage("customer")}
          onOpenMap={openMapPage}
          onOpenCommunity={openCommunityPage}
          onOpenGroupbuy={openGroupbuyPage}
          onOpenAuth={openAuth}
          isAuthenticated={isAuthenticated}
          nickname={nickname}
          totalSaving={totalSaving}
          monthlySaving={monthlySaving}
          monthlyPurchaseCount={monthlyGroupbuyPurchaseRecords.length}
          visitRecords={visitRecords}
          groupbuyPurchaseRecords={monthlyGroupbuyPurchaseRecords}
          likedPlaces={likedPlaces}
          likedGroupbuyProducts={likedGroupbuyProducts}
          onSignOut={handleSignOut}
        />
      )}
      {page === "customer" && (
        <CustomerCenter
          onBack={() => setPage("mypage")}
          onOpenMap={openMapPage}
          onOpenCommunity={openCommunityPage}
          onOpenGroupbuy={openGroupbuyPage}
        />
      )}
      {page === "customize" && (
        <CharacterCustomizePage
          onBack={() => setPage("mypage")}
          onOpenMap={openMapPage}
          onOpenCommunity={openCommunityPage}
          onOpenGroupbuy={openGroupbuyPage}
          nickname={nickname}
          level={1}
          points={0}
        />
      )}
    </main>
  );
}

function createUserPostDetail(post, fallbackNickname = "기특한진희") {
  return {
    id: post.id,
    dbId: post.dbId,
    storageKey: post.storageKey,
    canManage: post.canManage,
    pageClassName: post.detailPageClassName || "",
    header: {
      title: "게시글 상세",
      backIcon: pdpBackIcon,
    },
    category: post.badge,
    title: post.title,
    author: {
      avatar: pdpWriterCharacter,
      name: post.authorName || fallbackNickname,
      level: post.authorLevel || "LV.1",
      time: post.time,
      views: "조회 0",
    },
    body: post.body,
    images: post.photoUrl
      ? [{ thumbnail: post.photoUrl, full: post.photoUrl }]
      : [],
    actions: [
      { label: "좋아요", count: post.likes, icon: pdpThumbUpIcon },
      { label: "저장하기", count: 0, icon: pdpFavouriteIcon },
      { label: "공유하기", count: 0, icon: pdpShareIcon },
    ],
    comments: [],
    commentConfig: {
      thumbIcon: pdpCommentThumbIcon,
      inputIcon: pdpCommentIcon,
      sortIcon: pdpSortIcon,
      newCommentAuthor: {
        avatar: pdpWriterCharacter,
        name: post.authorName || fallbackNickname,
      },
    },
  };
}

function mapDatabaseCommunityPost(row, fallbackNickname = "기특한진희", currentUserId = null) {
  const category = row.category || "이용후기";
  const meta = communityCategoryMeta[category] || communityCategoryMeta["이용후기"];
  return {
    id: `db-user-${row.id}`,
    dbId: row.id,
    storageKey: `community-post-${row.id}`,
    userPage: true,
    badge: category,
    badgeTone: meta.badgeTone,
    detailPageClassName: meta.detailPageClassName,
    title: row.title,
    body: row.content,
    authorName: row.author_name || fallbackNickname,
    authorLevel: "LV.1",
    location: meta.location,
    time: formatRelativeTime(row.created_at),
    likes: 0,
    photoUrl: row.photo_url || "",
    canManage: Boolean(currentUserId && row.user_id === currentUserId),
  };
}

function formatRelativeTime(value) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs) || diffMs < 60_000) return "방금 전";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}
