import React from "react";
import { figmaAssets } from "../data/figmaAssets.js";

export default function SplashPage() {
  return (
    <section className="phone-page figma-splash" aria-label="기특기특 스플래시">
      <img className="splash-frame-image" src={figmaAssets.splashFrame} alt="기특기특 스플래시" />
    </section>
  );
}
