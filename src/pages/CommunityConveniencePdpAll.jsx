import ConveniencePdpPage from "../components/convenience/ConveniencePdpPage.jsx";

export default function CommunityConveniencePdpAll({ onBack, ...navigationProps }) {
  return <ConveniencePdpPage initialFilter="all" onBack={onBack} {...navigationProps} />;
}
