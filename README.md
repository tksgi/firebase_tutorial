# Firebase CLI
https://firebase.google.com/docs/functions/get-started?hl=ja

## Firebase CLI のインストール
npmでインストールする
```sh
npm install -g firebase-tools
```
`firebase` コマンドをアップデートする場合も上記のコマンドを利用する

## Firebase CLI ログイン
以下のコマンドでfirebaseにログインする
```sh
firebase login
```

ESET等のセキュリティソフトを利用していて、` Firebase CLI が Google アカウントへのアクセスをリクエストしています` の画面から動かなくなってしまった場合は以下のオプションを付けて実行する

```sh
firebase login --no-localhost
```

## プロジェクトの初期化
Firebaseのプロジェクトを作成するディレクトリで以下のコマンドを実行する
```sh
firebase init functions
```
ここでTypescriptを選択することができる

ここで初期化された段階で `firebase-functions` と `firebase-admin` のライブラリがインポートされている
node関連のファイルは `functions` ディレクトリ配下にあるので、npmコマンドを叩く時はそちらに移動してから叩く


## functionのデプロイ
以下のコマンドで関数のデプロイを行う
```sh
firebase deploy --only functions
```
出力の中にURLがあるため、そこにアクセスすれば関数がトリガーされる
