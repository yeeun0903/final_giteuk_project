# 기특기특 캐릭터 꾸미기 프로토타입

기특기특 서비스에서 기특이 캐릭터 꾸미기와 성장 시스템을 실제 서비스에 적용할 수 있는지 검증하기 위한 React + Vite 프로토타입이다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소로 접속한다.

## 파일 구조

```text
gtgt-character-prototype
├── public
│   └── assets
│       └── gtgt-body.png
├── src
│   ├── components
│   │   ├── CharacterCustomizePage.jsx
│   │   ├── CharacterPreview.jsx
│   │   └── MyPage.jsx
│   ├── data
│   │   └── items.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

## 구현 내용

- 첨부된 기특이 PNG를 `body` 레이어로 사용한다.
- 의상, 모자, 안경, 가방, 액세서리, 배경을 React State로 제어한다.
- 아이템 클릭 시 캐릭터 미리보기에 즉시 반영된다.
- 랜덤 코디 버튼으로 아이템을 무작위 적용한다.
- 전체 벗기 버튼으로 장착 아이템을 제거한다.
- 저장하기 버튼 클릭 시 `저장되었습니다` 토스트를 출력한다.
- 모션 보기 버튼으로 CSS 기반 캐릭터 애니메이션을 확인한다.
- 마이페이지의 생존 등급 카드를 누르면 캐릭터 꾸미기 화면으로 이동한다.

## 레이어 구조

```text
CharacterPreview
├── BodyLayer
├── ClothesLayer
├── HatLayer
├── GlassesLayer
├── BagLayer
└── AccessoryLayer
```

현재는 아이템 이미지가 없기 때문에 CSS 레이어로 의상과 소품을 표현한다.  
향후 실제 PNG, GIF, Lottie 에셋이 준비되면 각 Layer 컴포넌트 내부만 교체하면 된다.
