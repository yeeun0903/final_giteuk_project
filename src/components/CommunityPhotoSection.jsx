import reportImage from "../assets/Community_main/posting_image01.png";
import reviewImage from "../assets/Community_main/posting_image02.png";
import discountImage from "../assets/Community_main/posting_image03.png";
import sojuImage from "../assets/Community_main/posting_image06.png";

const images = {
  bottle: reportImage, // 제보하기
  meal: reviewImage, // 이용후기
  discount: discountImage, // 할인정보
  soju: sojuImage, // 소주이미지
};

export default function CommunityPhotoSection({ variant, src }) {
  const imageSrc = src || images[variant];

  return (
    <div className={imageSrc ? "post-photo" : "post-photo is-placeholder"} aria-hidden="true">
      {imageSrc && <img src={imageSrc} alt="" />}
    </div>
  );
}
