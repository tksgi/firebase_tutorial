import * as functions from 'firebase-functions';

// firestoreに接続するためにfirebase-adminを利用する
import * as admin from 'firebase-admin';
admin.initializeApp();

// ログ出し
// import * from '@google-cloud/logging'

// stripeのインポート
// https://github.com/stripe/stripe-node#usage-with-typescript
import Stripe from 'stripe'
const stripe_token = functions.config().stripe.token;
const stripe = new Stripe(stripe_token, {
  apiVersion: '2020-03-02',
  typescript: true,
});


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase-firestore/functions/index.js
// リクエストのtextパラメータの値をfirestoreに格納
export const addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.body.text;
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// firestoreに値が格納されたタイミングでトリガーされる
// 格納された値を大文字に変換してuppercaseフィールドに格納
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
                                                     .onCreate((snap, context) => {
                                                       const original = snap.data()!.original;
                                                       console.log('Uppercasing', context.params.documentId, original);
                                                       const uppercase = original.toUpperCase();
                                                       return snap.ref.set({uppercase}, {merge: true});
                                                     });


// stripeのカスタマーを作成
export const createCustomer = functions.https.onRequest(async (req, res) => {
  const params: Stripe.CustomerCreateParams = {
    description: `create test customer named ${req.body.name || "test"}`,
  };

  const customer: Stripe.Customer = await stripe.customers.create(params);

  console.log(customer.id);
  res.send("customer successfully created!");
});

// shopデータを作成
export const addShop = functions.https.onRequest(async (req, res) => {
  console.log(req.body.shopname)
  const shopName = req.body.shopname || "test shop"
  const writeResult = await admin.firestore().collection('shop').add({name: shopName});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});
// shopにサブコレクションとしてメニューを追加
export const addMenuToShop = functions.https.onRequest(async (req, res) => {
  const shopName = req.body.shopname
  const menu = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  };

  const query = (await admin.firestore().collection('shop').where('name', '==', shopName).get()).docs
  switch(query.length) {
    case 0:
      res.json({result: 'Error Happend! Please confirm log'});
      break;
    case 1:
       break;
    default:
      res.json({result: `Error! Shop name ${shopName} is not unique`});
  }
  query.forEach(doc => {
    console.log(doc)
    console.log(doc.data())
    console.log(doc.id)
  });
  const writeResult = await admin.firestore().collection('shop').doc(query[0].id).collection('menu').add(menu)
  res.json({result: `Menu with ID: ${writeResult.id} added.`});
});


// ユーザー作成
// export const addUser = functions.https.onRequest(async (req, res) => {
//   // phoneNumberは+を入れないとemptyと判定される？
//   const userRecord = await admin.auth().createUser({
//     email: "tetsu.kasugaib+a@sun-asterisk.com",
//     emailVerified: false,
//     phoneNumber: "+01234567890", 
//     password: "Passw0rd"
//   });
//   res.json({result: `User with ID: ${userRecord.uid} added.`});
// });

// ユーザー作成時にユーザー情報ドキュメントを作成
exports.addUserInfo = functions.auth.user().onCreate(async (event) => {
  console.log(event)
  const user = admin.firestore().collection('users').doc(event.uid);
  const snapshot = await user.get();
  console.log(snapshot);
  // if(snapshot.exists){
  //   return null
  // }else{
  //   return await user.set({phoneNumber: event.phoneNumber});
  // }
  await admin.auth().setCustomUserClaims(event.uid, {
    suspended: false,
    role: 'user'
  })
});

// 入れ子になったデータを作成/取得する
export const createOrder = functions.https.onRequest(async (req, res) => {
  console.log('function called');
  const param = {
    'orderItems': [
      {'price': 100},
      {'price': 200},
    ]
  };
  console.log('param created');
  console.log(param);
  const collectionRef = admin.firestore().collection('orders');
  console.log('get collection Reference');
  const writeResult = await collectionRef.add(param);
  console.log('added document');
  res.json({result: `Menu with ID: ${writeResult.id} added.`});
});

export const getOrderPrice = functions.https.onRequest(async (req, res) => {
  const ordersRef = admin.firestore().collection('orders');
  const ordersSnap = await ordersRef.get();
  ordersSnap.forEach(orderSnap => {
    let priceSum = 0;
    const orderItems: Array<{[key: string]: any;}> = orderSnap.get('orderItems');
    console.log(orderItems);
    orderItems.forEach((orderItem: {[key: string]: any;}) => {
      const price: number = orderItem['price'];
      console.log(price);
      priceSum += price;
    });
    console.log(`sum of price is ${priceSum}`);
  })

  //if(orderData == null){
  //  res.send("Order Data is not exist");
  //  return;
  //}
  ////let price = 0;
  //for(const orderItem in orderData.orderItems){
  //  //price += orderItem.price;
  //  console.log(orderItem);
  //  //console.log(orderItem.price);
  //};
  //console.log(orderSnap.get('orderItems'));
  //res.send(`Order items: ${orderData.orderItems}`);
  res.send('sum of price is');
});
