const express = require("express");
const app = express();
const PORT = 8081;
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running good ;)",
  });
});

app.use("/books", booksRoutes);
app.use("/users", usersRoutes);

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
  console.log(`Server listening on port ${PORT}`);
});
