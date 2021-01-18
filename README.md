# Sample project of [frourio](https://github.com/frouriojs/frourio)

[![CI Status](https://github.com/technote-space/frourio-demo/workflows/CI/badge.svg)](https://github.com/technote-space/frourio-demo/actions)
[![codecov](https://codecov.io/gh/technote-space/frourio-demo/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/frourio-demo)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/frourio-demo/badge)](https://www.codefactor.io/repository/github/technote-space/frourio-demo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/frourio-demo/blob/main/LICENSE)

Frourio (Next.js + Fastify + Prisma) を使用した予約管理業務アプリのデモ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- param::isFolding::false:: -->
<!-- param::isNotitle::true:: -->
<!-- param::isCustomMode::true:: -->

<p align="center">
<a href="#getting-started">Getting Started</a>
<span>|</span>
<a href="#demo">Demo</a>
<span>|</span>
<a href="#author">Author</a>
</p>

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

1. セットアップ
   ```bash
   yarn setup
   ```

   1. パッケージのインストール
   1. ビルド
   1. マイグレーション
   1. シーディング

1. サーバ起動
   ```bash
   yarn start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo
https://technote-space.github.io/frourio-demo/

* id: test@example.com
* pass: test1234

## 要件
* 部屋の管理
* 各部屋の現在の予約状況の確認
* 予約登録
* 利用者の管理
  * 名前/住所/電話番号
* 月毎の売り上げ金額の確認
* 当日の清掃対象(チェックアウト)の一覧の確認

## 構成
### フロントエンド
* [Next.js](https://nextjs.org/)
  * React Context による SPA
* [Aspida](https://github.com/aspida/aspida)
  * 型付きのHTTPクライアント
* [Material-UI](https://material-ui.com/)
  * デザインフレームワーク

### バックエンド
* [Fastify](https://www.fastify.io/)
  * 軽量な Node.js フレームワーク
* [Prisma](https://www.prisma.io/)
  * ORM

### テスト
* [Jest](https://jestjs.io/ja/)
  * [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### CI/CD
* [GitHub Actions](https://github.co.jp/features/actions)
  * Lint
  * テスト
  * GitHub Pages
  * GitHub Releases
* [Heroku](https://jp.heroku.com/)

### その他
* GitHub Actions
  * 目次生成自動化
  * PRとIssueのラベル付与自動化
  * PRとIssueのプロジェクト登録自動化
  * アサイン自動化
  * 依存モジュール更新自動化
  * PRに更新内容追記自動化
  * [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0-beta.4/) に基づく次のバージョンの決定自動化
  * package.json のバージョン更新自動化
  * リリースタグ付与自動化

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
