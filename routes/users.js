const express = require("express");
const users = require("../data/users.json");
const router = express.Router();


/**
 * Route: /
 * Method: GET
 * Description: Fetch all users
 * Access: Public
 * Parameters: None
 * Returns: Array of users
 */

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Fetch Users Successfull",
    data: users,
  });
});

/**
 * Route: /:id
 * Method: GET
 * Description: Fetch user by ID
 * Access: Public
 * Parameters: id
 * Returns: User object
 */
router.get("/:id", (req, res) => {
  //const id = req.params.id;
  // or
  const { id } = req.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.status(200).json({
    message: "Fetch User by ID Successfull",
    data: user,
  });
});

/**
 * Route: /
 * Method: POST
 * Description: Create a new user
 * Access: Public
 * Parameters: None
 * Returns: Created user object
 */
router.post("/", (req, res) => {
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
    });
  } else {
    users.push(newUser);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: users,
    });
  }
});

/**
 * Route: /:id
 * Method: PUT
 * Description: Update a user
 * parameter: id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  const user = users.find((user) => user.id == id);
  if (!user) {
    return res.status(500).json({
      message: "Oops! There is no such user!",
    });
  } else {
    const userIndex = users.findIndex((user) => user.id == id);
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    return res.status(201).json({
      success: true,
      message: "User updated successfully!",
      data: users[userIndex],
    });
  }
});

/**
 * Route: /subscription-details/:id
 * Method: GET
 * Description: Fetch all users subscription details
 * Access: Public
 * Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const dateInDays = (data = "") => {
    let date;
    let days;
    if (data === "") {
      date = new Date();
    } else { 
      date = new Date(data);
    }
    days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType == "Basic") {
      date += 30;
    } else if (user.subscriptionType == "Standard") {
      date += 180;
    } else if (user.subscriptionType == "Premium") {
      date += 365;
    }
    return date;
  };

  const returnDateInDays = dateInDays(user.returnDate);
  const today = dateInDays();
  const subscriptionDateInDays = dateInDays(user.subscriptionDate);
  const subscriptionExpiry = subscriptionType(subscriptionDateInDays);
  const daysRemaining = subscriptionExpiry - returnDateInDays;

  const data = {
    ...user,
    isSubscriptionExpired: subscriptionExpiry < today,
    daysLeftForExpiration: subscriptionExpiry <= today ? 0 : daysRemaining,
    fine: returnDateInDays < today ? (subscriptionExpiry ? 100 : 50) : 0,
  };

  res.status(200).json({
    message: "User subscription details",
    data,
  });

})

/**
 * Route: /:id
 * Method: DELETE
 * Description: Delete user by id
 * parameters: id
 * results: Delete user from list
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id == id);
  const MsReturnDate = new Date(user.returnDate).getTime();
  const MsToday = new Date().getTime();
  const MsSubscription = new Date(user.subscriptionDate).getTime();
  const subscriptionType = user.subscriptionType;
  const subscriptionDuration = {
    Basic: 30,
    Standard: 180,
    Premium: 365,
  };
  const subscriptionEndDate = new Date(
    MsSubscription +
      subscriptionDuration[subscriptionType] * 24 * 60 * 60 * 1000
  );
  let overdueFine = 0;

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Oops! there is no such user",
    });
  }

  if (parseInt(user.issueBook, 10) > 0) {
    if (MsReturnDate < MsToday) {
      const daysOverdue = Math.floor(
        (MsToday - MsReturnDate) / (1000 * 60 * 60 * 24)
      );
      overdueFine = daysOverdue * 50;
    }
    if (subscriptionEndDate < MsToday) {
      overdueFine += 100;
    }

    return res.status(500).json({
      message: `Sorry can't delete User. Fines pending: ${overdueFine}`,
    });
  } else {
    const userIndex = users.findIndex((user) => user.id == id);
    users.splice(userIndex, 1);
    return res.status(200).json({
      message: "User deleted succeessfull!",
    });
  }
});



module.exports = router;