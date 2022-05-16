import { createWriteStream, mkdir } from 'fs';
//const {createWriteStream,mkdir} = require('fs')

const  fcDirectUpload = require("./helpers");

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = 'image';
  const path = `images/test-${filename}`;
  return new Promise((resolve, reject) => stream
    .pipe(createWriteStream(path))
    .on('finish', () => resolve({
      id, path, filename, mimetype,
    }))
    .on('error', reject));
};
  
const resolvers = {
    Query: {
      uploads: async () => {
        
      }
    },
    Mutation: {
      async singleUpload(parent, { file }) {
          console.log(file);
          const { createReadStream, filename, mimetype } = await file;
          mkdir('images', { recursive: true }, (err) => {
            if (err) throw err;
          });
          const stream = createReadStream();
          const File = await storeUpload({ stream, filename, mimetype });
          return file;
      }
    },
  };


  module.exports= resolvers