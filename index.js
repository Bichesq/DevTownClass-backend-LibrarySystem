const express = require("express")
// import express from express;
const app = express();
const PORT = 8081
const books = require("./data/books.json");
const users = require("./data/users.json")

app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        message: "Server is running good ;)",
    })
})

/** 
* Route: /users
* Method: GET
* Description: Fetch all users
* Access: Public
* Parameters: None
* Returns: Array of users
*/

app.get("/users", (req, res) => {
    res.status(200).json({
        message: "Fetch Users Successfull",
        data: users,
    })
})

/**
* Route: /users/:id
* Method: GET
* Description: Fetch user by ID
* Access: Public
* Parameters: id
* Returns: User object
*/
app.get("/users/:id", (req, res) => {
    //const id = req.params.id;
    // or
    const { id } = req.params;
    const user = users.find((user) => user.id == id );
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        })
    }
    res.status(200).json({
        message: "Fetch User by ID Successfull",
        data: user,
    })
})

/**
* Route: /users
* Method: POST
* Description: Create a new user
* Access: Public
* Parameters: None
* Returns: Created user object
*/
app.post("/users", (req, res) => {
    const newUser = req.body;

    if (!newUser) {
        return res.status(400).json({
            message: "User data is required",
        });
    }


    const user = users.find((user) => user.id == newUser.id);
    if (user) {
        return res.status(400).json({
            message: "User already exists",
        })
    } else {
        users.push(newUser);
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: users,
        })
    }
}) 

/**
 * Route: /users
 * Method: PUT
 * Description: Update a user
 * parameter: id
 */
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body

    const user = users.find((user) => user.id == id)
    if (!user) {
        return res.status(500).json({
            message: "Oops! There is no such user!"
        })
    } else {
        const userIndex = users.findIndex((user) => user.id == id);
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        return res.status(201).json({
          success: true,
          message: "User updated successfully!",
          data: users,
        });
    }
})

/**
 * Route: /users
 * Method: DELETE
 * Description: Delete user by id
 * parameters: id
 * results: Delete user from list
 */
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id == id)

    if (!user) {
        return res.status(500).json({
            success: false,
            message: "Oops! there is no such user"
        })
    }

    if (parseInt(user.issueBook, 10) > 0) {
      if (user.returnDate < new Date()) {
        return res.status(500).json({
          message: "Sorry can't delete User. Fines pending",
        });
      }
    } else {
      return res.status(200).json({
        message: "User deleted succeessfull!",
      });
    }
    
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

