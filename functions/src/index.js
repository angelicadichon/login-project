import * as functions from 'firebase-functions';

// You can add your functions here later
// For now, this is just a placeholder to make deployment work

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});