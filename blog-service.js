const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'danilovityk', '4Nrow0nclMzU', {
    host: 'ep-steep-base-90367442-pooler.us-east-1.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


async function initialize()
{
    // Get the category list from server.
   
    return new Promise((resolve, reject) => {
        reject();
    });

}

async function getAllPosts()
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

async function getPublishedPostsByCategory(category)
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

async function getPublishedPosts()
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

async function getCategories()
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

function addPost(postData)
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

function getPostsByCategory(category)
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

function getPostsByMinDate(minDateStr)
{
    return new Promise((resolve, reject) => {
        reject();
    });

}

function getPostById(id)
{
    return new Promise((resolve, reject) => {
        reject();
    });

}


module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory};
