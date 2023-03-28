const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books,null,4));
    })
    myPromise.then((output) => {
        return res.send(output)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    resolve(req.params.isbn);
    })
    myPromise.then((output) => {
        return res.send(books[output])
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let output = [];
    let myPromise = new Promise((resolve, reject) => {
        for (const [key, value] of Object.entries(books)) {
            if(value["author"] === author){
                output.push(value);
            }
        }
        resolve(output);
    })
    myPromise.then((output) => {
        return res.send(output)
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let output = [];
    let myPromise = new Promise((resolve, reject) => {
        for (const [key, value] of Object.entries(books)) {
            if(value["title"] === title){
                output.push(value);
            }
        }
        resolve(output);
    });
    myPromise.then((output) => {
        return res.send(output)
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
