const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");
const favicon = require("serve-favicon");

const db = require("./models");
const passportConfig = require("./passport");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");

dotenv.config();

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
} else {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: ["http://localhost:3000", "dobbyshow.com", "http://54.180.137.66/"],
    credentials: true,
  })
);

app.use("/", express.static(path.join(__dirname, "postImg")));
// "/"는 현재 서버 localhost3100을 의미  __dirname 뜻은 현재 풀더를 뜻함.
app.use("/", express.static(path.join(__dirname, "userImg")));

app.use("/", express.static(path.join(__dirname, "img")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3100, () => {
  console.log("서버 실행 중!");
});
