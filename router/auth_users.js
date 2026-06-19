const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

let user = users.find(user => user.username === username);
  return user ? false : true; // false = already exists

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let user = users.find(user => 
    user.username === username && user.password === password
  );
  return user ? true : false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  
const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    
    let accessToken = jwt.sign(
      { data: username },
      "fingerprint_customer",
      { expiresIn: 60 * 60 } // 1 hour
    );

    req.session.authorization = {
      accessToken
    };

    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });
  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.user.data;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully"
  });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.data; // from JWT middleware
    const isbn = req.params.isbn;
  
    // check book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // check user review exists
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // delete review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully"
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
