const express = require('express');
const books = require("../data/books.json");
const users = require("../data/users.json");
const router = express.Router();

/**
 * Route: /
 * Method: GET
 * Description: Fetch all books
 * Access: Public
 * Parameters: None
 * Returns: Array of books
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    });
});


/**
 * Route: /
 * Method: POST
 * Description: Create a new book
 * Access: Public
 * Parameters: None
 * Returns: New book
 */
router.post("/", (req, res) => {
    const newBook = req.body;
    if (newBook.id) {
        books.push(newBook);
        res.status(201).json({
            success: true,
            data: newBook
    });
    }
    
});

/**
 * Route: /books/issued
 * Method: GET
 * Description: Fetch all issued books
 * Access: Public
 * Parameters: None
 * Returns: Array of issued books   
 */
router.get("/issued", (req, res) => {
    const userWithIssuedBooks = users.filter((user) => {
        if (user.issueBook) return user;
    });
    const issuedBooks = [];
    userWithIssuedBooks.forEach((user) => {
        const book = books.find((book) => book.id == user.issueBook);
        book.issuedTo = user.name;
        book.issuedDate = user.issueDate;
        book.returnDate = user.returnDate;

        issuedBooks.push(book);
    });
    if (!issuedBooks.length) {
        return res.status(404).json({
            success: false,
            message: "No books issued yet"
        });
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    });
    
});

/**
 * Route: /:id
 * Method: GET
 * Description: Fetch all books
 * Access: Public
 * Parameters: None
 * Returns: book with id
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.find((book) => book.id == id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }
    res.status(200).json({
        success: true,
        data: book
    });
});
module.exports = router;
