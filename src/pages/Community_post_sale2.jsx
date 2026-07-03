import CommunityPostDetailLayout from "../components/community/CommunityPostDetailLayout.jsx";
import { communitySojuSalePost } from "../data/communityPostData.js";

export default function CommunityPostSale2({ onBack, ...navigationProps }) {
  return (
    <CommunityPostDetailLayout
      post={communitySojuSalePost}
      onBack={onBack}
      {...navigationProps}
    />
  );
}
