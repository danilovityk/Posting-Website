
/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Danylo Vityk Student ID: 176326213 Date: 31 Oct, 2023
*
*  Online (Cyclic) Link: https://filthy-cod-swimsuit.cyclic.cloud/about
*
************************************************************************************/  

const multer = require("multer");
const stripJs = require('strip-js');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const serv = require('./blog-service')
const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
app.use(express.static('public')); 

const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options)
        {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options)
        {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue)
            {
                return options.inverse(this);
            } else
            {
                return options.fn(this);
            }
        },
        safeHTML: function (context)
        {
            return stripJs(context);
        }
    }
}));
app.set('view engine', 'hbs');

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


    app.use(function(req,res,next){
        let route = req.path.substring(1);
        app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
        app.locals.viewingCategory = req.query.category;
        next();
    });

    
app.get('/', (req, res) => {
    res.redirect('/blog');
});
  
app.get('/about', (req, res) =>
{
    res.render('about', { body: 'about' });
});

// app.get('/blog', (req, res) =>
// {
//     serv.getPublishedPosts()
//         .then((data) => { res.send(data) })
//         .catch((err) => res.send({ "message": err }))
// });

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await serv.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await serv.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await serv.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});
  
app.get('/posts', (req, res) =>
{
    if (req.query.category)
    {
        serv.getPostsByCategory(req.query.category)
            .then((result) => res.render('posts', { posts: result }))
            .catch((err) => res.send({ "message:": err }));
        
    } else if (req.query.minDate)
    {
        serv.getPostsByMinDate(req.query.minDate)
            .then((result) => res.render('posts', { posts: result }))
            .catch((err) => res.send({ "message:": err }));
        
    } else
    {
        serv.getAllPosts()
            .then((data) => res.render('posts', { posts: data }))
            .catch((err) => res.send({ message: "no results" }))
        
    }
});
  
app.get('/categories', (req, res) => {
    serv.getCategories()
        .then((data) =>  res.render('categories', {categories: data}))
        .catch((err) => res.render("categories", {message: "no results"}))
});

app.get('/posts/add', (req, res) =>
{
    res.render('addPost', {body: 'addPost'});
    
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
  

app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await serv.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await serv.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        
        viewData.post = await serv.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await serv.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});
  

app.use((req, res) => {
    res.status(404).render('404');
});
  

