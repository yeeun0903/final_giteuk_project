import React from "react";

const lookBasePath = "/assets/outfits";

function getLookImage(selection) {
  const clothes = selection.clothes || "none";
  const hat = selection.hat || "none";
  const bag = selection.bag || "none";
  const glasses = selection.glasses || "none";
  const fileName = `giteuk_${clothes}_${hat}_${bag}_${glasses}`;
  return `${lookBasePath}/${fileName}.png`;
}

export default function CharacterPreview({ selection, motion = false, compact = false }) {
  const backgroundClass = selection.background || "lavender-room";
  const lookImage = getLookImage(selection);

  return (
    <section className={`preview-stage ${backgroundClass} ${compact ? "compact" : ""}`}>
      <div className={`character-stack ${motion ? "motion-mode" : ""}`}>
        <img className="character-body look-image" src={lookImage} alt="기특이 캐릭터 꾸미기 미리보기" />
      </div>
      {!compact && <div className="stage-shadow" />}
    </section>
  );
}
