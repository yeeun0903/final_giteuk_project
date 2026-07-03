import { useState } from "react";
import logo7eleven from "../../assets/Community_convenience_pdp_all/Logo_7eleven.png";
import logoCu from "../../assets/Community_convenience_pdp_all/Logo_CU.png";
import logoEmart24 from "../../assets/Community_convenience_pdp_all/Logo_emart24.png";
import logoGs25 from "../../assets/Community_convenience_pdp_all/Logo_GS25.png";
import placeholderImage from "../../assets/Community_convenience_pdp_all/source/image.png";

const brandLogos = [
  { keyword: "gs25", image: logoGs25, label: "GS25", className: "gs25" },
  { keyword: "cu", image: logoCu, label: "CU", className: "cu" },
  { keyword: "7", image: logo7eleven, label: "7-ELEVEN", className: "seven" },
  { keyword: "세븐", image: logo7eleven, label: "7-ELEVEN", className: "seven" },
  { keyword: "emart", image: logoEmart24, label: "emart24", className: "emart24" },
  { keyword: "이마트", image: logoEmart24, label: "emart24", className: "emart24" },
];

export default function ConvenienceProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const logo = getBrandLogo(product.brand_name);
  const price = formatPrice(product.price);
  const imageSrc = imageFailed || !product.image_url ? placeholderImage : product.image_url;

  return (
    <article className="convenience-product-card">
      <div className="convenience-product-image">
        <img
          src={imageSrc}
          alt={product.product_name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>

      <div className="convenience-product-head">
        {logo ? (
          <span className="convenience-brand-logo-wrap">
            <img
              className={`convenience-brand-logo convenience-brand-logo-${logo.className}`}
              src={logo.image}
              alt={logo.label}
            />
          </span>
        ) : (
          <span className="convenience-brand-name">{product.brand_name}</span>
        )}
        <span className="convenience-event-badge">{product.event_type}</span>
      </div>

      <h2>{product.product_name}</h2>
      <strong>{price}</strong>
    </article>
  );
}

function getBrandLogo(brandName) {
  const normalized = brandName.toLowerCase().replace(/\s+/g, "");
  return brandLogos.find((logo) => normalized.includes(logo.keyword));
}

function formatPrice(price) {
  const number = Number(String(price).replace(/[^\d]/g, ""));

  if (!number) {
    return price;
  }

  return `${number.toLocaleString("ko-KR")}원`;
}
