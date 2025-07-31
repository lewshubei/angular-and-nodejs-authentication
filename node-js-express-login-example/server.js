const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

app.use(cors());

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync().then(() => {
  console.log("Synced db.");
  initial();
});
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);
function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      name: "user",
    },
  });

  Role.findOrCreate({
    where: { id: 2 },
    defaults: {
      id: 2,
      name: "moderator",
    },
  });

  Role.findOrCreate({
    where: { id: 3 },
    defaults: {
      id: 3,
      name: "admin",
    },
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
