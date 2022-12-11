const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { Op, Sequelize } = require("sequelize");

const { Post, Image, User, Comment, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("postImg");
} catch (error) {
  console.log("postImg 풀더가 없으므로 생성합니다.");
  fs.mkdirSync("postImg");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "show-aws",
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// UPLOAD POST
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      searchName: req.body.searchName,
      activityName: req.body.activityName,
      kinds: req.body.kinds,
      UserId: req.user.id,
    });
    const regexHashtag = req.body.hashtag.match(/#[^\s#]+/g);

    if (regexHashtag) {
      const result = await Promise.all(
        regexHashtag.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      await post.addHashtags(result.map((hashtag) => hashtag[0]));
    }
    console.log(req.body.image);
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));

        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const postSuccess = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(postSuccess);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),

  async (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map((img) => img.location));
  }
);

// GET OTHER USER POSTS
router.get("/:userId/userposts", async (req, res, next) => {
  try {
    const where = { userId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: Image,
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: Hashtag,
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST SEARCH
router.get("/:search/posts", async (req, res, next) => {
  const where = { title: decodeURIComponent(req.params.search) };
  if (parseInt(req.query.lastId, 10)) {
    where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
  }
  try {
    const posts = await Post.findAll({
      where,
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST REMOVE
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Comment.destroy({
      where: { PostId: req.params.postId },
    });
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    console.log(req.params.postId);
    res.json({ PostId: req.params.postId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST LIKE
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("상품이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST UNLIKE
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("상품이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// LOAD POST
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("Post Not Found");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "email"],
          include: [Image],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Saver",
          attributes: ["id", "nickname"],
        },
        {
          model: Hashtag,
          attributes: ["id", "name"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// COMMENT ADD
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body.postId);
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 상품입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.log("content" + req.body.content);
    console.error(error);
    next(error);
  }
});

// COMMENT REMOVE
router.delete("/comment/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
    });
    if (!comment) {
      return res.status(403).send("존재하지 않는 댓글입니다.");
    }
    await Comment.destroy({
      where: { id: req.params.commentId },
    });
    res.status(200).json({ commentId: parseInt(req.params.commentId, 10) });
    // parseInt를 안하면 프론트에서 받을때 스트링으로 받아서 바로 래더링이 안됨.ㅠㅠ 주위!
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// COMMENT CHANGE
router.patch("/comment/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
    });
    if (!comment) {
      return res.status(403).send("존재하지 않는 댓글입니다.");
    }
    await comment.update({
      content: req.body.content,
    });
    res.status(200).json({
      commentId: parseInt(req.params.commentId, 10),
      content: req.body.content,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST SAVE
router.patch("/:PostId/save", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 상품입니다.");
    }
    if (req.user.id === post.UserId) {
      return res.status(403).send("자신의 상품은 찜할수가 없습니다.");
    }
    await post.addSaver(req.user.id);
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST SAVE CANCEL
router.delete("/:PostId/save", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 상품입니다.");
    }
    if (req.user.id === post.UserId) {
      return res.status(403).send("자신의 상품은 찜 취소 불가능합니다.");
    }
    await post.removeSaver(req.user.id);
    res.status(201).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// UPDATE POST
router.patch("/:PostId", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
        lat: req.body.lat,
        lng: req.body.lng,
        searchName: req.body.searchName,
        activityName: req.body.activityName,
        kinds: req.body.kinds,
        UserId: req.user.id,
      },
      {
        where: {
          id: req.params.PostId,
          UserId: req.user.id,
        },
      }
    );
    const regexHashtag = req.body.hashtag.match(/#[^\s#]+/g);

    const post = await Post.findOne({ where: { id: req.params.PostId } });

    if (regexHashtag) {
      const result = await Promise.all(
        regexHashtag.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );
      await post.setHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.setImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.setImages(image);
      }
    }
    res.status(200).json({
      title: req.body.title,
      content: req.body.content,
      lat: req.body.lat,
      lng: req.body.lng,
      searchName: req.body.searchName,
      activityName: req.body.activityName,
      UserId: req.user.id,
      image: req.body.image,
    });
  } catch (error) {
    console.log(req.body.hashtag);

    console.error(error);
    next(error);
  }
});

module.exports = router;
