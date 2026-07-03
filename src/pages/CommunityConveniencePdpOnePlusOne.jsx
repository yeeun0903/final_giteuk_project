import ConveniencePdpPage from "../components/convenience/ConveniencePdpPage.jsx";

export default function CommunityConveniencePdpOnePlusOne({ onBack, ...navigationProps }) {
  return <ConveniencePdpPage initialFilter="1+1" onBack={onBack} {...navigationProps} />;
}
