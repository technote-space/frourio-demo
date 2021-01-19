# Sample project of [Frourio](https://github.com/frouriojs/frourio)

[![CI Status](https://github.com/technote-space/frourio-demo/workflows/CI/badge.svg)](https://github.com/technote-space/frourio-demo/actions)
[![codecov](https://codecov.io/gh/technote-space/frourio-demo/branch/main/graph/badge.svg)](https://codecov.io/gh/technote-space/frourio-demo)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/frourio-demo/badge)](https://www.codefactor.io/repository/github/technote-space/frourio-demo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/frourio-demo/blob/main/LICENSE)

[Frourio](https://github.com/frouriojs/frourio) (Next.js + Fastify + Prisma) を使用した予約管理アプリのデモ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- param::isFolding::false:: -->
<!-- param::isNotitle::true:: -->
<!-- param::isCustomMode::true:: -->

<p align="center">
<a href="#screenshot">Screenshot</a>
<span>|</span>
<a href="#getting-started">Getting Started</a>
<span>|</span>
<a href="#demo">Demo</a>
<span>|</span>
<a href="#%E8%A6%81%E4%BB%B6">要件</a>
<span>|</span>
<a href="#%E6%A7%8B%E6%88%90">構成</a>
<span>|</span>
<a href="#author">Author</a>
</p>

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Screenshot

![screenshot](https://raw.githubusercontent.com/technote-space/frourio-demo/images/screenshot.gif)

## Getting Started

1. セットアップ
   ```bash
   yarn setup
   ```

    1. パッケージのインストール
    1. ビルド
    1. マイグレーション
    1. シーディング
    

2. サーバ起動
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

* [GitHub Pages](https://docs.github.com/ja/github/working-with-github-pages/about-github-pages)
* [Next.js](https://nextjs.org/)
    * React Context による SPA
* [Aspida](https://github.com/aspida/aspida)
    * 型付きのHTTPクライアント
* [Material-UI](https://material-ui.com/)
    * デザインフレームワーク

### バックエンド

* [Heroku](https://jp.heroku.com/)
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

* [GitHub Actions](https://github.co.jp/features/actions)
    * 目次生成自動化 [TOC Generator](https://github.com/technote-space/toc-generator)
    * PRとIssueのラベル付与自動化 [PR Labeler](https://github.com/TimonVS/pr-labeler-action), [Pull Request Labeler](https://github.com/actions/labeler)
    * PRとIssueのプロジェクト登録自動化 [Create Project Card Action](https://github.com/technote-space/create-project-card-action)
    * アサイン自動化 [Assign Author](https://github.com/technote-space/assign-author)
    * 依存モジュール更新自動化 [Create PR Action](https://github.com/technote-space/create-pr-action)
    * PRに更新内容追記自動化 [PR Commit Body Action](https://github.com/technote-space/pr-commit-body-action)
    * [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0-beta.4/) に基づく次のバージョンの決定自動化 [Release Type Action](https://github.com/technote-space/release-type-action), [Get Next Version Action](https://github.com/technote-space/get-next-version-action)
    * package.json のバージョン更新自動化 [Package Version Check Action](https://github.com/technote-space/package-version-check-action)
    * リリースタグ付与自動化 [actions/github-script](https://github.com/actions/github-script)

## Author

[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
