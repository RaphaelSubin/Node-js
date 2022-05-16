const firebaseadmin = require('firebase-admin');
const uuid = require('uuid-v4');
const serviceAccount = require('../assets/file/serviceAccount.json');

firebaseadmin.initializeApp({
  credential: firebaseadmin.credential.cert(serviceAccount),
  databaseURL: 'https://cloudtrav.firebaseio.com',
  storageBucket: 'gs://cloudtrav.appspot.com',
});
const bucket = firebaseadmin.storage().bucket();
class FirebaseService {
  static async uploadFile(file) {
    const filename = file.path;
    const token = uuid();
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
      cacheControl: 'public, max-age=31536000',
    };
    const resp = await bucket.upload(filename, {
      metadata,
    });

    return resp;
  }
}

export default FirebaseService;
