import ConveniencePdpPage from "../components/convenience/ConveniencePdpPage.jsx";

export default function CommunityConveniencePdpThreePlusOne({ onBack, ...navigationProps }) {
  return <ConveniencePdpPage initialFilter="3+1" onBack={onBack} {...navigationProps} />;
}
