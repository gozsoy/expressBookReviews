const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    let un = req.body.username
    let pw = req.body.password

    if (!un || !pw){
        return res.status(400).send("Username or password not entered");
    }
    else{
        if (isValid(un)){
            users.push([un, pw])
            return res.status(200).send("Registered successfully");
        }
        else{
            return res.status(400).send("Username not valid");
        }
    }

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    
    let promise = new Promise((resolve)=>{
        setTimeout(()=>{resolve(books)},1000)
    })

    let result = await promise

    return res.status(200).send(JSON.stringify(result))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  
    let isbn_code = req.params.isbn

    let promise = new Promise((resolve)=>{
        setTimeout(()=>{resolve(books)},1000)
    })

    let result = await promise    

    if (isbn_code in result){
        return res.status(200).send(result[isbn_code])
    }
    else{
        return res.status(400).send("Invalid ISBN code");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {

    let temp_author = req.params.author
    let return_d = []

    let promise = new Promise((resolve)=>{
        setTimeout(()=>{resolve(books)},1000)
    })

    let result = await promise    


    for (const temp in result){
        if (result[temp].author == temp_author){
            return_d.push(result[temp])
        }
    }

    if (return_d.length == 0){
        return res.status(400).send("Author not found")
    }
    else{
        return res.status(200).send(return_d)
    }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let temp_title = req.params.title
    let return_d = []

    let promise = new Promise((resolve)=>{
        setTimeout(()=>{resolve(books)},1000)
    })

    let result = await promise        

    for (const temp in result){
        if (result[temp].title == temp_title){
            return_d.push(result[temp])
        }
    }

    if (return_d.length == 0){
        return res.status(400).send("Title not found")
    }
    else{
        return res.status(200).send(return_d)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn_code = req.params.isbn

    if (isbn_code in books){
        return res.status(200).send(books[isbn_code].reviews)
    }
    else{
        return res.status(400).send("Invalid ISBN code");
    }
});

module.exports.general = public_users;
