# 開発用

## セットアップ

プロジェクトルートに移動し以下を実行

```shell
make setup
nvm use
```

環境変数の用意と [NVM](https://github.com/nvm-sh/nvm) のインストール

## スタート

```shell
make up
```

* MySQL
* MailDev

Docker Compose が動作する環境が必要  
[Docker Compose のインストール](https://docs.docker.jp/compose/install.html#docker-compose)

### メール

[MailDev](https://github.com/maildev/maildev) で送信されたメールをキャッチ  
http://localhost:1080/
で閲覧可能

## ストップ

```shell
make down
```
