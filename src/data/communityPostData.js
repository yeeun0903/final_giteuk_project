import pdpBackIcon from "../assets/Community_post_pdp/Back icon.png";
import pdpWriterCharacter from "../assets/Community_post_pdp/006_giteuk_clothes2_hat_none_none.png";
import pdpCommenterCharacter from "../assets/Community_post_pdp/level01.png";
import pdpLevelTwoCharacter from "../assets/Community_post_pdp/level02.png";
import pdpPhotoOne from "../assets/Community_post_pdp/posting_image01.png";
import pdpPhotoTwo from "../assets/Community_post_pdp/posting_image01-2 2.png";
import pdpPhotoThree from "../assets/Community_post_pdp/posting_image01-3 1.png";
import pdpPhotoOneLarge from "../assets/Community_post_pdp/source/KakaoTalk_20260627_222323310_02.jpg";
import pdpPhotoTwoLarge from "../assets/Community_post_pdp/source/posting_image01-2.jpg";
import pdpPhotoThreeLarge from "../assets/Community_post_pdp/source/posting_image01-3.jpg";
import pdpAddressIcon from "../assets/Community_post_pdp/Button_Address.png";
import pdpChevronRight from "../assets/Community_post_pdp/chevron-right.png";
import pdpThumbUpIcon from "../assets/Community_post_pdp/Button_ThumbUp.png";
import pdpCommentThumbIcon from "../assets/Community_post_pdp/Button_ThumbUp-1.png";
import pdpFavouriteIcon from "../assets/Community_post_pdp/favourite.png";
import pdpShareIcon from "../assets/Community_post_pdp/Button_Share.png";
import pdpCommentIcon from "../assets/Community_post_pdp/Button_WriteComment.png";
import pdpSortIcon from "../assets/Community_post_pdp/chevron-down.png";

import saleBackIcon from "../assets/Community_post_sale/Back icon.png";
import saleWriterCharacter from "../assets/Community_post_sale/006_giteuk_clothes2_hat_none_none.png";
import salePhoto from "../assets/Community_post_sale/IMG_8482 1.png";
import salePhotoLarge from "../assets/Community_post_sale/source/IMG_8482.jpg";
import saleThumbUpIcon from "../assets/Community_post_sale/Button_ThumbUp.png";
import saleFavouriteIcon from "../assets/Community_post_sale/favourite.png";
import saleShareIcon from "../assets/Community_post_sale/Button_Share.png";
import saleCommentIcon from "../assets/Community_post_sale/Button_WriteComment.png";
import saleSortIcon from "../assets/Community_post_sale/chevron-down.png";
import sojuPhotoOne from "../assets/Community_post_sale2/image 39.png";
import sojuPhotoTwo from "../assets/Community_post_sale2/image 40.png";
import sojuPhotoThree from "../assets/Community_post_sale2/image 41.png";
import sojuPhotoLarge from "../assets/Community_post_sale2/source/image.png";
import sojuPhotoLargeTwo from "../assets/Community_post_sale2/source/image2.png";
import sojuPhotoLargeThree from "../assets/Community_post_sale2/source/image3.png";
import reportPhotoOne from "../assets/Community_post_report/image01.png";
import reportPhotoTwo from "../assets/Community_post_report/image02.png";
import reportPhotoLarge from "../assets/Community_post_report/source/image.png";
import reportPhotoLargeTwo from "../assets/Community_post_report/source/image02.png";

export const communityReviewPost = {
  pageClassName: "",
  header: {
    title: "게시글 상세",
    backIcon: pdpBackIcon,
  },
  category: "이용후기",
  title: "강남 점심 제육 만원인데 양 많고 쌈도 줘요",
  author: {
    avatar: pdpWriterCharacter,
    name: "기특한진희",
    level: "LV.3",
    time: "2시간 전",
    views: "조회 85",
  },
  body: "요즘 점심 제대로 먹으려면 1.3~1.5인데 제육에 야채도 많고 쌈까지\n주는데 만원이네요. 맛있는데 가성비까지 최고\n강남역 부근 직장인 분들 불맛 나는 제육 먹고 싶을 때 추천합니다!!",
  images: [
    { thumbnail: pdpPhotoOne, full: pdpPhotoOneLarge },
    { thumbnail: pdpPhotoTwo, full: pdpPhotoTwoLarge },
    { thumbnail: pdpPhotoThree, full: pdpPhotoThreeLarge },
  ],
  address: {
    icon: pdpAddressIcon,
    chevronIcon: pdpChevronRight,
    text: "서울 강남구 강남대로6길 18 1층 101호",
    strong: "주도락 강남점",
  },
  mapPlace: {
    id: "community-joodorak-gangnam",
    place_id: "community-joodorak-gangnam",
    place_name: "주도락 강남점",
    category: "식당",
    address: "서울 강남구 강남대로6길 18 1층 101호",
    latitude: 37.4998472,
    longitude: 127.0284735,
    phone: "",
    menu1: "제육쌈밥",
    price1: 10000,
    price1Text: "10,000원",
    menu2: "점심 메뉴",
    price2: 10000,
    price2Text: "10,000원",
    description: "강남 직장인 점심으로 좋은 가성비 제육 맛집",
    district: "강남구",
    images: [pdpPhotoOne, pdpPhotoTwo, pdpPhotoThree],
  },
  actions: [
    { label: "좋아요", count: 25, icon: pdpThumbUpIcon },
    { label: "저장하기", count: 32, icon: pdpFavouriteIcon },
    { label: "공유하기", count: 10, icon: pdpShareIcon },
  ],
  comments: [
    {
      id: 1,
      avatar: pdpLevelTwoCharacter,
      name: "맛집헌터",
      time: "26분 전",
      body: "여기 안주도 맛있었는데 점심도 하는줄 몰랐네요.\n좋은 정보 감사해요👍",
      likes: 6,
    },
    {
      id: 2,
      avatar: pdpWriterCharacter,
      name: "기특한진희",
      time: "7분 전",
      body: "다른 메뉴도 많아요!!",
      likes: 2,
      highlighted: true,
    },
    {
      id: 3,
      avatar: pdpCommenterCharacter,
      name: "가성비러버",
      time: "1시간 전",
      body: "팀에 제육킬러 있는데 ㅋㅋ 같이 가봐야겠어요",
      likes: 10,
    },
  ],
  commentConfig: {
    thumbIcon: pdpCommentThumbIcon,
    inputIcon: pdpCommentIcon,
    sortIcon: pdpSortIcon,
    newCommentAuthor: {
      avatar: pdpWriterCharacter,
      name: "기특한진희",
    },
  },
};

export const communitySalePost = {
  pageClassName: "pdp-frame-sale",
  header: {
    title: "게시글 상세",
    backIcon: saleBackIcon,
  },
  category: "할인정보",
  title: "CU 무료 배달+2천원 할인쿠폰 이벤트",
  author: {
    avatar: saleWriterCharacter,
    name: "기특한진희",
    level: "LV.3",
    time: "1시간 전",
    views: "조회 75",
  },
  body: "CU 유저분들, CU 배달 생기고 프로모션 하네요. \n 배달비 원래 3천원인데 무료고 할인 쿠폰도 줘요. \n 이벤트할 때 이용해봐요~",
  images: [{ thumbnail: salePhoto, full: salePhotoLarge, variant: "large" }],
  actions: [
    { label: "좋아요", count: 60, icon: saleThumbUpIcon },
    { label: "저장하기", count: 40, icon: saleFavouriteIcon },
    { label: "공유하기", count: 8, icon: saleShareIcon },
  ],
  comments: [],
  commentConfig: {
    thumbIcon: saleThumbUpIcon,
    inputIcon: saleCommentIcon,
    sortIcon: saleSortIcon,
    newCommentAuthor: {
      avatar: saleWriterCharacter,
      name: "기특한진희",
    },
  },
};

export const communitySojuSalePost = {
  pageClassName: "pdp-frame-sale2",
  header: {
    title: "게시글 상세",
    backIcon: saleBackIcon,
  },
  category: "할인정보",
  title: "강남 소주 2,000원 실화인가요?",
  author: {
    avatar: saleWriterCharacter,
    name: "기특한진희",
    level: "LV.3",
    time: "1시간 전",
    views: "조회 123",
  },
  body: "역삼 포차 소주 2천원. 안주도 가성비 좋고 회사 사람들이랑\n부담없이 한잔하기 좋아요.",
  images: [
    { thumbnail: sojuPhotoOne, full: sojuPhotoLarge },
    { thumbnail: sojuPhotoTwo, full: sojuPhotoLargeTwo },
    { thumbnail: sojuPhotoThree, full: sojuPhotoLargeThree },
  ],
  actions: [
    { label: "좋아요", count: 100, icon: saleThumbUpIcon },
    { label: "저장하기", count: 86, icon: saleFavouriteIcon },
    { label: "공유하기", count: 53, icon: saleShareIcon },
  ],
  comments: [],
  commentConfig: {
    thumbIcon: saleThumbUpIcon,
    inputIcon: saleCommentIcon,
    sortIcon: saleSortIcon,
    newCommentAuthor: {
      avatar: saleWriterCharacter,
      name: "기특한진희",
    },
  },
};

export const communityReportPost = {
  pageClassName: "pdp-frame-report",
  header: {
    title: "게시글 상세",
    backIcon: saleBackIcon,
  },
  category: "제보하기",
  title: "역삼역 포차 소주 2000원",
  author: {
    avatar: saleWriterCharacter,
    name: "기특한진희",
    level: "LV.3",
    time: "1시간 전",
    views: "조회 107",
  },
  body: "포차에서 소주 2천원. 안주도 가성비 좋고 회사 사람들이랑\n부담없이 한잔하러 가기 좋아요.",
  images: [
    { thumbnail: reportPhotoOne, full: reportPhotoLarge },
    { thumbnail: reportPhotoTwo, full: reportPhotoLargeTwo },
  ],
  actions: [
    { label: "좋아요", count: 21, icon: saleThumbUpIcon },
    { label: "저장하기", count: 32, icon: saleFavouriteIcon },
    { label: "공유하기", count: 10, icon: saleShareIcon },
  ],
  comments: [],
  commentConfig: {
    thumbIcon: saleThumbUpIcon,
    inputIcon: saleCommentIcon,
    sortIcon: saleSortIcon,
    newCommentAuthor: {
      avatar: saleWriterCharacter,
      name: "기특한진희",
    },
  },
};
