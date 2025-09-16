# タイムゾーンマップ

グローバルなタイムゾーン境界をインタラクティブなフィルタリング機能と経線による理論的な時差表示で可視化するReact-TypeScriptアプリケーションです。

## 機能

- **インタラクティブなタイムゾーン選択**: プルダウンメニューから37種類のタイムゾーンオフセットを選択可能
- **地図クリックでタイムゾーン参照**: 地図上でクリックすると、クリック地点のタイムゾーンを選択状態に変更
- **視覚的なタイムゾーンハイライト**: 選択されたタイムゾーンがマップ上で色付きポリゴンでハイライト表示
- **経線表示**: 15度ごとの経度線と理論的な時差ラベルを表示
- **レスポンシブデザイン**: フローティングコントロール付きのフルスクリーンマップインターフェース
- **効率的なレンダリング**: MapLibre GLとPMTilesを使用した高速ベクタータイル描画

## デモ

🌍 **[GitHub Pagesで公開中](https://hirofumikanda.github.io/timezone-map)**

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **マッピング**: MapLibre GL JS
- **データ形式**: PMTiles（ベクタータイル）+ GeoJSON
- **ビルドツール**: Vite
- **デプロイ**: GitHub Pages

## はじめに

### 前提条件

- Node.js（v18以上）
- npm

### インストール

1. リポジトリをクローンします：
```bash
git clone https://github.com/hirofumikanda/timezone-map.git
cd timezone-map
```

2. 依存関係をインストールします：
```bash
npm install
```

3. 開発サーバーを起動します：
```bash
npm run dev
```

4. ブラウザで `http://localhost:5173` にアクセスします

## データソース

- **タイムゾーン境界**: UTC_offsetプロパティ付きGeoJSON（出典：[世界の標準時子午線（沼津高専）](https://user.numazu-ct.ac.jp/~tsato/webmap/timezone/)）
- **国境**: PMTilesベクタータイル（出典：[Natural Earth（Admin 0 – Countries）](https://www.naturalearthdata.com/)）
- **国名ラベル**: GeoJSONポイントデータ（出典：[Natural Earth（Admin 0 – Countries）](https://www.naturalearthdata.com/)）

## プロジェクト構造

```
src/
├── components/
│   └── MapView.tsx      # メインマップコンポーネント
├── App.tsx              # ルートコンポーネント
└── main.tsx            # エントリーポイント

public/
├── data/               # 地理空間データファイル
│   ├── timezone.geojson
│   ├── country.pmtiles
│   └── country_label.geojson
├── font/              # マップ用フォント
└── styles/
    └── style.json     # MapLibreスタイル設定
```

## 主要機能の実装

### タイムゾーン選択
- 37のタイムゾーンオプション（UTC-11:00からUTC+14:00）を含むプルダウンメニュー
- UTC_offsetプロパティに基づくリアルタイムマップフィルタリング
- 動的なレイヤー表示制御

### 経線表示
- 15°ごとにプログラム的に生成される経度線
- 理論的な時差計算とラベル表示
- 視認性向上のための破線スタイルとテキストハロー

### マップ設定
- 効率的なベクタータイル配信のためのPMTilesプロトコル統合
- 複数のデータソース（タイムゾーンポリゴン、国境、ラベル）
- ナビゲーションコントロール付きレスポンシブデザイン

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。
