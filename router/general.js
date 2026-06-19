const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
const username = req.body.username;
  const password = req.body.password;

  // check missing fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // check user already exists
  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  // add new user
  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
const axios = require('axios');

// Route gốc (Task 1)
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


public_users.get('/books', function (req, res) {
    return res.status(200).json(books);
  });
  

// Route async (Task 10)
public_users.get('/books-async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');

    return res.status(200).json({
      message: "Books fetched using async/await",
      data: response.data
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error fetching books",
      error: err.message
    });
  }
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);

//   return res.status(300).json({message: "Yet to be implemented"});
 });

public_users.get('/isbn-async/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  
      return res.status(200).json({
        message: "Book fetched using async/await",
        data: response.data
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching book",
        error: err.message
      });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
const author = req.params.author;
  const result = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  });

  return res.status(200).json(result);

//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/author-async/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
  
      return res.status(200).json({
        message: "Books fetched by author using async/await",
        data: response.data
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching books by author",
        error: err.message
      });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
const title = req.params.title;
  const result = [];

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  });

  return res.status(200).json(result);

//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/title-async/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      return res.status(200).json({
        message: "Books fetched by title using async/await",
        data: response.data
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching books by title",
        error: err.message
      });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);

//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
