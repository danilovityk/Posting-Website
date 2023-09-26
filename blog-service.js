const fs = require('fs')
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

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories };
