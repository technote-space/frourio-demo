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
<a href="#%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2">管理画面</a>
<span>|</span>
<a href="#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88">フロント</a>
<span>|</span>
<a href="#%E9%83%A8%E5%B1%8B%E9%8D%B5">部屋鍵</a>
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

## 管理画面

![admin](https://raw.githubusercontent.com/technote-space/frourio-demo/images/admin.gif)

1. セットアップ
   ```bash
   yarn setup
   ```

2. ビルド
   ```bash
   yarn build
   ```

3. サーバ起動
   ```bash
   yarn start
   ```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## フロント

![front](https://raw.githubusercontent.com/technote-space/frourio-demo/images/front.gif)

1. セットアップ
   ```bash
   yarn setup
   yarn setup:front
   ```

2. ビルド
   ```bash
   yarn build
   ```

3. サーバ起動
   ```bash
   yarn start
   ```

ブラウザで [https://localhost.frourio-demo.com:3001/](https://localhost.frourio-demo.com:3001/) にアクセス

### SSL証明書
Auth0 の認証にSSLでのアクセスが必要なため、ローカル用のSSL証明書の作成が必要です。  
`yarn setup:front` コマンドは [mkcert](https://github.com/FiloSottile/mkcert) を使用して証明書を作成します。  
macOSのみ動作確認済みです。  
Linuxもインストール用スクリプトを用意していますが動作未確認です。  
Windowsは対応していません。

ホスト名: `localhost.frourio-demo.com`  

### `yarn setup:front`
#### macOS
1. `/etc/hosts` に `localhost.frourio-demo.com` の設定がない場合は追記  
1. mkcert, nss をインストール
1. mkcert で証明書を作成

#### Linux
1. `/etc/hosts` に `localhost.frourio-demo.com` の設定がない場合は追記
1. mkcert, nss をインストール
   1. Linuxbrew をインストール
   1. Linuxbrew で mkcert, nss をインストール
1. mkcert で証明書を作成

## 部屋鍵
予約当日の１２時に入室用の情報がメール送信されます。  
QRコード または テンキーの入力でチェックインが完了します。

![lock](https://raw.githubusercontent.com/technote-space/frourio-demo/images/lock.gif)

1. セットアップ
   ```bash
   yarn setup
   ```

2. ビルド
   ```bash
   yarn build
   ```

3. サーバ起動
   ```bash
   yarn start
   ```

ブラウザで [http://localhost:3002](http://localhost:3002) にアクセス

## Demo

https://technote-space.github.io/frourio-demo/

## 要件

* 管理画面
  * マスタの管理（部屋、顧客、予約）
  * 各部屋の現在の予約状況の確認
  * 月毎の売り上げ金額の確認
  * 当日の清掃対象(チェックアウト)の一覧の確認
* フロント
  * 予約登録
  * オンライン決済
* 部屋
  * 入室の自動化（QRコード、テンキー）

## 構成

### フロントエンド

* [GitHub Pages](https://docs.github.com/ja/github/working-with-github-pages/about-github-pages)
* [Next.js](https://nextjs.org/)
    * React Context による SPA（管理画面）
    * React Router DOM による SPA（フロント、部屋鍵）
* [Aspida](https://github.com/aspida/aspida)
    * 型付きのHTTPクライアント
* [Material-UI](https://material-ui.com/)
    * デザインフレームワーク（管理画面）
* [Chakra UI](https://chakra-ui.com/)
    * コンポーネントライブラリ（フロント、部屋鍵）

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
