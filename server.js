const serv = require('./blog-service')
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation ot the console
serv.initialize()
    .then(() =>
    {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`))
    }).catch((err)=>{
    console.log(err)
    })

app.get('/', (req, res) => {
    res.redirect('/about');
});
  
app.get('/about', (req, res) => {
    res.sendFile('/Users/danilovityk/Desktop/web322-app/views/about.html');
});

app.get('/blog', (req, res) =>
{
    serv.getPublishedPosts().then((data) =>{res.json(data)}).catch((err) => res.send({"message": err}))
});
  
app.get('/posts', (req, res) =>
{
    serv.getAllPosts().then((data) => { res.json(JSON.stringify(data)) }).catch((err) => res.send({"message": err}))
});
  
app.get('/categories', (req, res) => {
    serv.getCategories().then((data) => {res.json(data)}).catch((err) => res.send({"message": err}))
});
  
