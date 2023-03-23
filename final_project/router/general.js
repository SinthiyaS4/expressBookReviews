const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function(req, res) {
    const { username, password } = req.body;
  
    // Check if both fields are provided
    if (!username || !password) {
      res.status(400).send('Please provide both username and password');
      return;
    }
  
    // Check if username already exists
    if (users[username]) {
      res.status(409).send('Username already exists');
      return;
    }
  
    // Register new user
    users[username] = {
      username,
      password
    };
  
    res.send('Registration successful');
  });
  
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const matchingBooks = [];
    for (const key in books) {
      if (books.hasOwnProperty(key) && books[key].isbn.toLowerCase() === isbn.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.send(`No books found for isbn '${isbn}'`);
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
    for (const key in books) {
      if (books.hasOwnProperty(key) && books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      res.send(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.send(`No books found for author '${author}'`);
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let bookDetails = null;
    for (let id in books) {
      if (books[id].title === title) {
        bookDetails = books[id];
        break;
      }
    }
    if (bookDetails) {
      res.send(JSON.stringify(bookDetails, null, 2));
    } else {
      res.send("Book not found");
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let bookReviews = null;
    for (let id in books) {
      if (books[id].isbn === isbn) {
        bookReviews = books[id].reviews;
        break;
      }
    }
    if (bookReviews) {
      res.send(JSON.stringify(bookReviews, null, 2));
    } else {
      res.send("Reviews not found for the book");
    }
  });
  

module.exports.general = public_users;
