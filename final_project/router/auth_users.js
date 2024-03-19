const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let temp_users = users.filter((tpl) => tpl[0]==username)

    if (temp_users.length==0){
        return true
    }
    else{
        return false
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let temp_users = users.filter((tpl) => tpl[0]==username)

    if (temp_users[0][1]==password){
        return true
    }
    else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
            }, 'access', { expiresIn: 60 * 60 });
        
        req.session.authorization = {
            accessToken, username
        }
        
        res.status(200).send("User logged in.")
    }
    else{
        res.status(403).json({message: "User not authenticated"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn_code = req.params.isbn
  let username = req.session.authorization['username']
  let comment = req.query.review

  if (!username in books[isbn_code]['reviews']){
    books[isbn_code]['reviews'].username = comment
  }
  else{
    books[isbn_code]['reviews'][username] = comment
  }

  return res.status(200).send(books[isbn_code]['reviews'])

});

regd_users.delete("/auth/review/:isbn", (req, res)=>{

    let isbn_code = req.params.isbn
    let username = req.session.authorization['username']
  
    if (!username in books[isbn_code]['reviews']){
        return res.status(400).send("No reviews found")
    }
    else{
      delete books[isbn_code]['reviews'][username]

      return res.status(200).send(books[isbn_code]['reviews'])
    }
  
    

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
