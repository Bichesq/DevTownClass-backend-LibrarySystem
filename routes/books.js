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
        const book = books.find((book) => book.id == newBook.id);
        if (book) {
            return res.status(400).json({
                success: false,
                message: "Book already exists"
            });
        }
        const allBooks = [...books, newBook];
        // books.push(newBook);
        res.status(201).json({
            success: true,
            data: allBooks
    });
    }
    else {
        res.status(400).json({
            success: false,
            message: "Please provide a valid book id"
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
 * Route: /books/issued/withfine
 * Method: GET
 * Description: Fetch all issued books with fine
 * Access: Public
 * Parameters: None
 * Returns: Array of issued books with fine
 */
router.get("/issued/withfine", (req, res) => { 
    const userWithIssuedBooks = users.filter((user) => { 
        if (user.issueBook) return user;
    })
    const issuedBookswithFine = [];
    userWithIssuedBooks.forEach((user) => {
        const book = books.find((book) => book.id == user.issueBook);
        const ReturnDateInDays = new Date(user.returnDate).getTime() / (1000 * 60 * 60 * 24);
        const today = new Date().getTime() / (1000 * 60 * 60 * 24);
        const subscriptionTerm = {
            Basic: 30,
            Standard: 180,
            Premium: 365,
        };
        const subscriptionDateInDays = new Date(user.subscriptionDate).getTime() / (1000 * 60 * 60 * 24);
        const subscriptionEndDateInDays = subscriptionDateInDays + subscriptionTerm[user.subscriptionType];
        let fine = 0;
        if (today > subscriptionEndDateInDays) {
            fine += 100;
        }
        if (today > ReturnDateInDays) {
            fine += 50;
        }
        
        book.issuedTo = user.name;
        book.IsWithFine = today > ReturnDateInDays || today > subscriptionEndDateInDays;
        book.fine = fine; 

        if (book.IsWithFine) {
            issuedBookswithFine.push(book);
        }
    })
    if (!issuedBookswithFine.length) {
        return res.status(404).json({
            success: false,
            message: "No books with fine"
        });
    }
    res.status(200).json({
        success: true,
        data: issuedBookswithFine
    });
})

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

/**
 * Route: /:id
 * Method: PUT
 * Description: Update a book by id
 * Access: Public
 * Parameters: id
 * Returns: Updated book
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const book = books.find((book) => book.id == id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book with ${id} not found`
        });
    } else if (!update) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid update"
        });
    }
    const updated = books.map((book) => {
        if (book.id == id) {
            return {...book, ...update}
        }
        return book;
    })
    res.status(200).json({
        success: true,
        data: updated
    });
});

module.exports = router;
