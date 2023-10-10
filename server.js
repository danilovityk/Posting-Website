
/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Danylo Vityk Student ID: 176326213 Date: 10 Oct, 2023
*
*  Online (Cyclic) Link: https://filthy-cod-swimsuit.cyclic.cloud/about
*
************************************************************************************/  

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const serv = require('./blog-service')
const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
app.use(express.static('public')); 
// start the server on the port and output a confirmation ot the console

cloudinary.config({
    cloud_name: 'dkzk0tvjv',
    api_key: '268492643317554',
    api_secret: 'qN8ksIMjoYF-DWGSqNYKPSkwDkM',
    secure: true
});

const upload = multer(); 

serv.initialize()
.then(() =>
{
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`))
}).catch((err)=>{
    console.log('Initialization error')
    })

app.get('/', (req, res) => {
    res.redirect('/about');
});
  
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/blog', (req, res) =>
{
    serv.getPublishedPosts()
        .then((data) => { res.send(data) })
        .catch((err) => res.send({ "message": err }))
});
  
app.get('/posts', (req, res) =>
{
    if (req.query.category)
    {
        serv.getPostsByCategory(req.query.category)
            .then((result) => res.send(result))
            .catch((err) => res.send({ "message:": err }));
        
    } else if (req.query.minDate)
    {
        serv.getPostsByMinDate(req.query.minDate)
            .then((result) => res.send(result))
            .catch((err) => res.send({ "message:": err }));
        
    } else
    {
        serv.getAllPosts()
            .then((data) => res.send(data))
            .catch((err) => res.send({ "message:": err }))
        
    }
});
  
app.get('/categories', (req, res) => {
    serv.getCategories()
        .then((data) => { res.send(data) })
        .catch((err) => res.send({ "message": err }))
});

app.get('/posts/add', (req, res) =>
{
    res.sendFile(path.join(__dirname, '/views/addPost.html'));
});

app.post('/posts/add', upload.single("featureImage"), (req, res,) =>
{    

    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        serv.addPost(req.body).then(() => res.redirect('/posts'))
    
    });
    
    
    
});

app.get('/posts/:value', (req, res) =>
{
    serv.getPostById(req.params.value)
        .then(result => res.send(result))
        .catch(err => res.send({ "message": err }))
});
  

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});
  

