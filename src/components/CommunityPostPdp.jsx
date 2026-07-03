import CommunityPostDetailLayout from "./community/CommunityPostDetailLayout.jsx";
import { communityReviewPost } from "../data/communityPostData.js";

export default function CommunityPostPdp({ onBack, ...navigationProps }) {
  return (
    <CommunityPostDetailLayout
      post={communityReviewPost}
      onBack={onBack}
      {...navigationProps}
    />
  );
}
