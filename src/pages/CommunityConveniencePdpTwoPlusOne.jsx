import ConveniencePdpPage from "../components/convenience/ConveniencePdpPage.jsx";

export default function CommunityConveniencePdpTwoPlusOne({ onBack, ...navigationProps }) {
  return <ConveniencePdpPage initialFilter="2+1" onBack={onBack} {...navigationProps} />;
}
