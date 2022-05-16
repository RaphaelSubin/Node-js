const  FirebaseService = require("./firebase");

const fcDirectUpload = async (Fpath) => {
    let filename;
    let mediaType;
    const filePath = {
      path: Fpath,
    };
    await FirebaseService.uploadFile(filePath).then(async (resp) => {
      const obj = resp[1];
      filename = `https://firebasestorage.googleapis.com/v0/b/cloudtrav.appspot.com/o/${obj.name}?alt=media&token=${obj.metadata.firebaseStorageDownloadTokens}`;
      mediaType = obj.contentType;
      fs.unlinkSync(Fpath);
    });
    const result = {
      filename,
      mediaType,
    };
    return result;
  };

  module.exports = fcDirectUpload;
 