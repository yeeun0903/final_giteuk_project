import CommunityPostDetailLayout from "../components/community/CommunityPostDetailLayout.jsx";
import { communitySalePost } from "../data/communityPostData.js";

export default function CommunityPostSale({ onBack, ...navigationProps }) {
  return (
    <CommunityPostDetailLayout
      post={communitySalePost}
      onBack={onBack}
      {...navigationProps}
    />
  );
}
