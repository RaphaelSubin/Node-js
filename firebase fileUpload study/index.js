const express = require('express')
const multer = require('multer')
const app = express();


app.use(express.urlencoded({extended:false}))
app.use(express.json({extended:false}))

const upload = multer({storage:multer.memoryStorage()})

app.post('/upload',upload.single('file'),(req,res) => {
    console.log('File upload API');
    if(!req.file) {
        res.status(400).send("Error: No files found")
    } else {
        const blob = firebase.bucket.file(req.file.originalname)
        
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        })
        
        blobWriter.on('error', (err) => {
            console.log(err)
        })
        
        blobWriter.on('finish', () => {
            res.status(200).send("File uploaded.")
        })
        
        blobWriter.end(req.file.buffer)
    }
})

app.listen(5000,() => {
    console.log("server running..");
})