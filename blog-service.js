const fs = require('fs')
const blogData = require("./blog-service");
var posts = [];
var categories = [];



async function initialize()
{
    // Get the category list from server.
   
    return new Promise((resolve, reject) =>
    {
        postsRead();
        function postsRead()
        {
            fs.readFile('./data/posts.json', 'utf8', (err, data) =>
            {
                if (err) reject(err);
                posts = JSON.parse(data);
                categoriesRead();
            }
            );
       } 
        function categoriesRead()
        {
            fs.readFile('./data/categories.json', 'utf8', (err, data) =>
            {
                if (err) reject(err);
                categories = JSON.parse(data);   
                resolve('Operation success');
            }
            );
          
        }
    });


    
}

async function getAllPosts()
{
    return new Promise((resolve, reject) =>
    {
        if (posts.length != 0)
        {
            resolve(posts);
        } else
        {
            reject('No results returned')
        }

    })
}

async function getPublishedPostsByCategory(category){
    return new Promise((resolve, reject) =>
    {
        if (posts.length != 0)
        {
            var publishedArray = [];
            posts.forEach(post => {
                if (post.published == true && post.category == category)
                {
                    publishedArray.push(post);
                }
            });
            resolve(publishedArray);
        } else
        {
            reject('No results returned')
        }

    })
}

async function getPublishedPosts()
{
    return new Promise((resolve, reject) =>
    {
        if (posts.length != 0)
        {
            var publishedArray = [];
            posts.forEach(post => {
                if (post.published == true)
                {
                    publishedArray.push(post);
                }
            });
            resolve(publishedArray);
        } else
        {
            reject('No results returned')
        }

    })
}

async function getCategories()
{
    return new Promise((resolve, reject) =>
    {
        if (categories.length != 0)
        {
            resolve(categories);
        } else
        {
            reject('No results returned')
        }
    })
}

function addPost(postData)
{
    return new Promise((resolve, reject) =>
    {
        if (!postData.published)
        {
            postData.published = false;
        } else
        {
            postData.published = true;
        }

        postData.id = posts.length + 1;
        var currentDate = new Date()
        postData.postDate = currentDate.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
        posts.push(postData)

        resolve(postData)
    })
}

function getPostsByCategory(category)
{
    return new Promise((resolve, reject) =>
    {
        var categorizedArray = []
        posts.forEach((post) =>
        {
            if (post.category == category) categorizedArray.push(post);
        })
        if (categorizedArray.length != 0)
        {
            resolve(categorizedArray);
        } else
        {
            reject("No Results Returned");
        }
    });
}

function getPostsByMinDate(minDateStr)
{
        return new Promise((resolve, reject) =>
        {
            var filteredArray = []
            posts.forEach((post) =>
            {
                if (new Date(post.postDate) >= new Date(minDateStr)) filteredArray.push(post);
                
            });
            if (filteredArray.length != 0)
            {
                resolve(filteredArray);
            } else
            {
                reject("No Results Returned");
            }
        })
}

function getPostById(id)
{
    return new Promise((resolve, reject) =>
    {
        posts.forEach(post =>
        {
            if (post.id == id) resolve(post)
        })
            
        
        reject("No object with given id found");
    })
}


module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory};
