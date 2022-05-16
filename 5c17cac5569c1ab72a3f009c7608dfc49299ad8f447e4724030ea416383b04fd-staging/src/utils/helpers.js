import fs, { createWriteStream, mkdir } from 'fs';
import uuid from 'uuid-v4';
import FirebaseService from './firebase';
import ch from '../assets/lang/chinese.json';
import jp from '../assets/lang/japanese.json';
import en from '../assets/lang/en.json';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const Ffmpeg = require('fluent-ffmpeg');

Ffmpeg.setFfmpegPath(ffmpegPath);

const infs = new Ffmpeg();

const Json2csvParser = require('json2csv').Parser;

const getPagingData = (datas, page, limit) => {
  const { count: totalItems, rows: data } = datas;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    data,
    totalPages,
    currentPage,
  };
};

const getPagination = (page, size) => {
  const limit = size ? +size : 50;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const lang = (value) => {
  console.log(value);
  let result = '';
  if (value === '1') {
    result = ch;
  }
  else if(value === '2'){
      result = en;
  }
  else if(value === '3'){
      result = jp;
  }
  return result;
};

const generateName = () => {
  let result = '';
  const length = 5;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `${result}`;
};

const uniqueId = () => {
  const id = uuid();
  return id;
};

const storeUpload = async ({ stream, filename, mimetype, Fpath }) => {
  const id = uuid();
  const path = `${Fpath}${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () =>
        resolve({
          id,
          path,
          filename,
          mimetype,
        })
      )
      .on('error', reject)
  );
};

const processUpload = async (upload, Fpath) => {
  const { createReadStream, filename, mimetype } = await upload;
  mkdir(Fpath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
  const stream = createReadStream();
  const file = await storeUpload({
    stream,
    filename,
    mimetype,
    Fpath,
  });
  return file;
};

const firebaseUpload = async (data, Fpath) => {
  let filename;
  let mediaType;
  const upload = await processUpload(data, Fpath);
  const { path } = upload;
  const filePath = { path };
  await FirebaseService.uploadFile(filePath).then(async (resp) => {
    const obj = resp[1];
    filename = `https://firebasestorage.googleapis.com/v0/b/cloudtrav.appspot.com/o/${obj.name}?alt=media&token=${obj.metadata.firebaseStorageDownloadTokens}`;
    mediaType = obj.contentType;
    fs.unlinkSync(path);
  });
  const result = {
    filename,
    mediaType,
  };
  return result;
};

const processUploadVideo = async (upload, Fpath) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype, Fpath });
  if (mimetype.indexOf('video') !== -1) {
    const d = await compress(file);
    fs.unlinkSync(file.path);
    return d;
  }
  const newImg = await compressImage(file);
  fs.unlinkSync(file.path);
  return newImg;
};

const compress = async (d) => {
  const rand = generateName();
  return new Promise((resolve) => infs.addInput(d.path).outputOptions([
    '-s:v:1 640x480',
    '-c:v:1 libx264',
    '-b:v:1 365k',
    '-crf 24',
    '-preset veryfast',
  ]).output(`uploads/videos/${rand}-video.mov`)
    .on('end', () => resolve({
      id: rand,
      path: `uploads/videos/${rand}-video.mov`,
      filename: d.filename,
      mimetype: 'video/mov',
    }))
    .run());
};

const firebaseVideoUpload = async (data, Fpath) => {
  const rand = generateName();
  let filename;
  let mediaType;
  const upload = await processUpload(data, Fpath);
  const { path } = upload;
  const filePath = { path };
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const Ffmpeg = require('fluent-ffmpeg');

Ffmpeg.setFfmpegPath(ffmpegPath);
    var proc = new Ffmpeg(filePath.path)
  .takeScreenshots({
    filename: `thumbnail_${rand}`,
      count: 1,
      timemarks: [ '2' ] // number of seconds
    }, 'uploads/videos', function(err) {
  });
  
  const thumbPath= {
    path: `uploads/videos/thumbnail_${rand}.png`
  }

  await FirebaseService.uploadFile(filePath).then(async (resp) => {
    const obj = resp[1];
    filename = `https://firebasestorage.googleapis.com/v0/b/cloudtrav.appspot.com/o/${obj.name}?alt=media&token=${obj.metadata.firebaseStorageDownloadTokens}`;
    mediaType = obj.contentType;
    fs.unlinkSync(path);
  });
  const result = {
    filename,
    mediaType,
    thumbPath,
  };
  return result;
};

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
const generateCsv = async (csvFields, Data, Name) => {
  const json2csvParser = new Json2csvParser({ csvFields });
  const jR = JSON.parse(JSON.stringify(Data));
  const csv = json2csvParser.parse(jR);
  fs.writeFile(Name, csv, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  getPagination,
  getPagingData,
  lang,
  generateName,
  firebaseUpload,
  firebaseVideoUpload,
  uniqueId,
  fcDirectUpload,
  generateCsv,
};
