const admin = require('firebase-admin')

admin.initializeApp({
    credential:admin.credential.cert('./serviceAccountkey.json'),
    storageBucket:"gs://file-upload-ed830.appspot.com/"
})


const bucket = admin.storage().bucket()

module.exports = {
    bucket

}