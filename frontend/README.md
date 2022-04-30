# frontend

## 概要

---

(割愛)

## プロジェクト構成

---

参考にしたのは

- [React のディレクトリ構成で Atomic デザインをやめた話](https://zenn.dev/brachio_takumi/articles/2ab9ef9fbe4159)
- [React ベストプラクティスの宝庫！「bulletproof-react」が勉強になりすぎる件](https://zenn.dev/meijin/articles/bulletproof-react-is-best-architecture)

```bash
frontend
  │  README.md
  │  .gitignore
  │  .eslintignore
  │  .eslintrc.json                  : 構文チェック設定
  │  .prettierrc.yaml                : 構文補正設定
  │  next.config.js                  : https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next.config.js/introduction
  │  next-env.d.ts                   : https://qiita.com/282Haniwa/items/ff3fc9cd783f6f418a35
  │  package.json                    : npm install
  │  package-lock.json               : https://zenn.dev/luvmini511/articles/56bf98f0d398a5
  │  postcss.config.js               : CSSビルド設定
  │  tailwind.config.js              : Tailwind CSS基本設定
  │  tsconfig.json                   : TypeScriptビルド設定
  │
  ├─docker
  │      Dockerfile                  : 開発コンテナ
  │      start.sh                    : 開始シェル
  │
  ├─src
  │  ├─common
  │  │  ├─hooks                   : React Hooks
  │  │  ├─lib                     : ライブラリ固有の機能
  │  │  ├─styles                  : CSS
  │  │  ├─types                   : モデル(MVCのM)
  │  │  └─utils                   : 便利な関数
  │  │
  │  ├─components                  : 共有コンポーネント
  │  │  ├─layouts                 : partsの組合せ（≒templates）
  │  │  ├─ui-parts                : elementの組合せ (≒molecules)
  │  │  ├─ui-elements             : 最小要素 (≒atoms)
  │  │  └─functional              : UIの無いコンポーネント
  │  │
  │  ├─features                    : 共有機能群(＞organisms)
  │  │
  │  └─pages                       : Webの1ページ
  │      │  _app.tsx                : 共通処理
  │      │  _document.tsx           : 共通レイアウト
  │      │  index.tsx               : エントリーポイント
  │      │
  │      └─api                     : APIエンドポイント
  │
  └─public
      └─assets                      : 静的ファイル。画像, フォント, 音など
```
