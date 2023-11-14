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

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
  
const Category = sequelize.define('Post', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});


async function initialize()
{
    return new Promise((resolve, reject) =>
    {
        sequelize.sync().then((data) =>
        {
            resolve(data);
        }).catch(err => reject('unable to sync the database'));
    });

}

async function getAllPosts()
{
    return new Promise((resolve, reject) => {
        Post.findAll().then(data => resolve(data))
            .catch(err => reject('no results retuned'));
    });
}

async function getPublishedPostsByCategory(category)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data => resolve(data)).catch(err => reject('no results returned'))
    });

}

async function getPublishedPosts()
{
    return new Promise((resolve, reject) => {
        Post.getAll({
            where: {
                published: true,
            }
        }).then(data => resolve(data)).catch(err => reject('no results returned'))
    });

}

async function getCategories()
{
    return new Promise((resolve, reject) => {
        Category.findAll().then(data =>
        {
           resolve(data)
       }).catch(err => reject('no results returned'))
    });

}

function addPost(postData)
{
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (prop in postData)
        {
            if (prop == "")
            {
                prop = null;
            }
        }
        postData.postDate = new Date();
        Post.create({
            title: postData.title,
            body: postData.body,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published
        }).then(resolve()).catch(err => reject('could not create an abject'))
    });

}

function getPostsByCategory(category)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
        }}).then((data) =>
        {
           resolve(data)
        }).catch(err => reject('no results returned'));
    });

}

function getPostsByMinDate(minDateStr)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: { $gte: new Date(minDateStr) }
            }
        }).then(data =>
        {
            
        }).catch(err => reject('No results returned'))
    });

}

function getPostById(id)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
            id: id
        }}).then(data =>
        {
            resolve(data[0])     
        }).catch (err => reject('no results returned'))
    });

}



module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory};
