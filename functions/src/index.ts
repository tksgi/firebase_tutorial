import * as functions from 'firebase-functions';

// firestoreに接続するためにfirebase-adminを利用する
import * as admin from 'firebase-admin';
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

// https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase-firestore/functions/index.js
// リクエストのtextパラメータの値をfirestoreに格納
export const addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
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
