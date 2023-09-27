
/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Danylo Vityk Student ID: 176326213 Date: 27 Sep, 2023
*
*  Online (Cyclic) Link: ________________________________________________________
*
************************************************************************************/  



const serv = require('./blog-service')
const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation ot the console
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

app.get('/public/css/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/css/main.css'));
});

app.get('/blog', (req, res) =>
{
    serv.getPublishedPosts()
        .then((data) => { res.send(data) })
        .catch((err) => res.send({ "message": err }))
});
  
app.get('/posts', (req, res) =>
{
    serv.getAllPosts()
        .then((data) => res.send(data))
        .catch((err) => res.send({ "message:": err }))
});
  
app.get('/categories', (req, res) => {
    serv.getCategories()
        .then((data) => { res.send(data) })
        .catch((err) => res.send({ "message": err }))
});
  
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
  });