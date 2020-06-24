require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Users = require("./models/Users");

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose
  .connect("mongodb://127.0.0.1/phackmate", { useNewUrlParser: true })
  .then(() => {
    console.log("[INFO] Connected to database!");
  });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use(async (req, res, next) => {
  let { username, _uid } = req.cookies;
  if (username) {
    Users.findOne({ username: username, _id: _uid }).then((user) => {
      if (user) {
        req.isLogged = true;
        next();
      } else {
        res.clearCookie("username");
        res.clearCookie("_uid");
        req.isLogged = false;
        next();
      }
    });
  } else next();
});

app.use("/upload", require("./routes/upload"));
app.use("/", require("./routes/code"));
app.use("/auth", require("./routes/auth"));
app.use("/abuse", require("./routes/abuse"));

const Posts = require("./models/Posts");

app.get("/", async (req, res) => {
  if (req.isLogged) {
    return Posts.find({ user: req.cookies.username }).then((posts) => {
      res.render("index", {
        isLogged: req.isLogged,
        posts: posts,
      });
    });
  }
  res.render("index", {
    isLogged: req.isLogged,
  });
});

app.listen(PORT, () => console.log(`Listining on *:${PORT}`));
