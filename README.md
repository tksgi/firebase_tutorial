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
https://firebase.google.com/docs/functions/get-started?hl=ja#makeuppercase-%E3%82%92%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%81%97%E3%81%A6%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B


# firestoreとの接続
接続には `firebase-admin` ライブラリを利用する
以下の2行でセットアップ
```javascript
import * as admin from 'firebase-admin';
admin.initializeApp();
```
以下のようにドキュメントを作成する
```javascript
const writeResult = await admin.firestore().collection('messages').add({original: original});
```

# stripeとの接続
## 環境変数の設定
以下のコマンドでCloud FunctionsにStripeのキーを設定する(反映させるにはデプロイが必要)
```sh
firebase functions:config:set stripe.token=<YOUR STRIPE API KEY>
```
 
## stripeのインポート
以下の様に初期化して、移行 `stripe` 変数から利用する
```javascript
import Stripe from 'stripe'
const stripe = new Stripe(functions.config().stripe.token, {
  apiVersion: '2020-03-02',
});
```
https://github.com/stripe/stripe-node#usage-with-typescript


**注：外部APIを叩くためには、Firestoreのプロジェクトを従量課金プランにする必要あり！**
