const firebase = require('firebase-admin')
const uuid = require('uuid-v4');
const serviceKey = require('./serviceAccountkey.json')
//const fcDirectUpload = require('./helpers')

firebase.initializeApp({
    credential:firebase.credential.cert(serviceKey),
    storageBucket:'gs://file-upload-ed830.appspot.com'
})

const bucket = firebase.storage().bucket();
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

module.exports = FirebaseService;


