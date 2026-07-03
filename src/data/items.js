export const tabs = [
  { id: "clothes", label: "옷", icon: "/assets/figma/character/clothes.svg" },
  { id: "bag", label: "가방", icon: "/assets/figma/character/bag.svg" },
  { id: "hat", label: "모자", icon: "/assets/figma/character/hat.svg" },
  { id: "glasses", label: "안경", icon: "/assets/figma/character/glasses.svg" }
];

export const itemsByCategory = {
  clothes: [
    {
      id: "clothes1",
      name: "블랙 트위드 자켓",
      price: "보유",
      swatch: "#7B5CFF",
      image: "/assets/item-thumbs/clothes1.png"
    },
    {
      id: "clothes2",
      name: "크림 트위드 자켓",
      price: "보유",
      swatch: "#4B19C9",
      image: "/assets/item-thumbs/clothes2.png"
    }
  ],
  hat: [
    {
      id: "hat",
      name: "클래식 베레모",
      price: "보유",
      swatch: "#4B19C9",
      image: "/assets/item-thumbs/hat.png"
    }
  ],
  bag: [
    {
      id: "bag",
      name: "클래식 플랩백",
      price: "보유",
      swatch: "#111118",
      image: "/assets/item-thumbs/bag.png"
    }
  ],
  glasses: [
    {
      id: "glasses",
      name: "골드블랙 선글라스",
      price: "보유",
      swatch: "#181820",
      image: "/assets/item-thumbs/sunglasses.png"
    }
  ]
};

export const initialSelection = {
  clothes: "",
  hat: "",
  bag: "",
  glasses: "",
  background: "lavender-room"
};
