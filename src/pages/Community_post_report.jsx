import CommunityPostDetailLayout from "../components/community/CommunityPostDetailLayout.jsx";
import { communityReportPost } from "../data/communityPostData.js";

export default function CommunityPostReport({ onBack, ...navigationProps }) {
  return (
    <CommunityPostDetailLayout
      post={communityReportPost}
      onBack={onBack}
      {...navigationProps}
    />
  );
}
