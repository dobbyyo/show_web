const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("userImg");
} catch (error) {
  console.log("make a userImg");
  fs.mkdirSync("userImg");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "foodweb-aws",
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// LOAD MY INFO
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id", "nickname"],
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.log(err);
    next(error);
  }
});

// AVATAR UPLOAD
router.post(
  "/image",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    console.log(req.files);
    res.json(req.file.location);
  }
);

// PASSWORD CHANGE
router.patch("/password", isLoggedIn, async (req, res, next) => {
  try {
    const comparePassword = await bcrypt.compare(
      req.body.currentPassword,
      req.user.password
    );
    const hashedPassword = await bcrypt.hash(req.body.changePassword, 10);
    if (comparePassword) {
      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: { id: req.user.id },
        }
      );
    } else {
      console.log(comparePassword);
      return res.status(403).send("비밀번호가 일치하지 않습니다.");
    }
    console.log(comparePassword);
    res.status(200).json("SUCCESS");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// JOIN
router.post("/join", async (req, res, next) => {
  try {
    console.log(req.body.name);
    console.log(req.body.email);
    const isEmail = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // const isId = await User.findOne({
    //   where: {
    //     nickname: req.body.nickname,
    //   },
    // });
    if (isEmail) {
      return res.status(403).send("이미 사용중인 이메일입니다.");
    }
    // if (isId) {
    //   return res.status(403).send("이미 사용중인 아이디입니다.");
    // }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      nickname: req.body.nickname,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json("SUCCESS");
  } catch (error) {
    console.log(req.body.email);
    console.error(error);
    next(error);
  }
});

// LOG IN
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id", "nickname"],
          },
          {
            model: Image,
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// LOG OUT
router.get("/logout", isLoggedIn, async (req, res, next) => {
  try {
    req.logout();
    req.session.destroy();
    res.send("SUCCESS");
  } catch (err) {
    console.log(err);
    next(error);
  }
});

// GET OTHER USER INFO
router.get("/:userId", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
          order: [["createdAt", "DESC"]],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// UPDATE USER
router.patch("/:UserId", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
        email: req.body.email,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    console.log("imggg" + req.body.image);

    if (req.body.image) {
      await Image.destroy({
        where: { UserId: req.user.id },
      });
      await Image.create({ src: req.body.image, UserId: req.user.id });
    }

    res.status(200).json({
      nickname: req.body.nickname,
      email: req.body.email,
      Image: req.body.image,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// FOLLOWER
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("유저가 존재하지 않습니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// UN FOLLOWER
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("유저가 존재하지 않습니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// FOLLOWER USER GET
router.get("/:userId/followers", async (req, res, next) => {
  try {
    const followers = await User.findAll({
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Followings",
          where: { id: req.params.userId },
        },
      ],
    });
    const where = {
      id: { [Op.in]: followers.map((v) => v.id) },
    };
    const users = await User.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: Image,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// FOLLOWING USER GET
router.get("/:userId/followings", async (req, res, next) => {
  try {
    const followings = await User.findAll({
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Followers",
          where: { id: req.params.userId },
        },
      ],
    });
    const where = {
      id: { [Op.in]: followings.map((v) => v.id) },
    };
    const users = await User.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: Image,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// USER DELETE
router.delete("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    await Comment.destroy({
      where: { UserId: req.params.userId },
    });
    await Post.destroy({
      where: { UserId: req.params.userId },
    });
    await User.destroy({
      where: { id: req.user.id },
    });
    res.status(200).json("SUCCESS");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
