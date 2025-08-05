const express = require("express")
// import express from express;
const app = express();
const PORT = 8081
const books = require("./data/books.json");
const users = require("./data/users.json")

app.get("/", (req,res) => {
    res.status(200).json({
        message: "Server is running good ;)",
    })
})

app.get("/users", (req, res) => {
    res.status(200).json({
        message: "Fetch Users Successfull",
        data: users,
    })
})

// app.get("*", (req,res)=> {
//     res.status(404).json({
//         message: "This route is non-existent!",
//     })
// })

app.use((req, res) => {
    if (!res.headersSent) {
        res.status(404).json({ message: "This route is non-existent!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

