const express = require("express");
const { Op, Sequelize } = require("sequelize");

const { Post, Image, User, Comment, Hashtag, sequelize } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 5,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "email"],
          include: [
            {
              model: Image,
            },
          ],
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
          model: Hashtag,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "Saver",
          attributes: ["id", "nickname"],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// SAVE POSTS GET
router.get("/:userId/saved", async (req, res, next) => {
  try {
    const saveId = await User.findAll({
      where: { id: req.params.userId },
      include: [
        {
          model: Post,
          as: "Saved",
        },
      ],
    });
    const where = {
      id: { [Op.in]: saveId[0].Saved.map((v) => v.id) },
    };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "email"],
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
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 카테고리 포스터들 GET
router.get("/:category/all", async (req, res, next) => {
  try {
    const categoryId = await Post.findAll({
      attributes: ["id", "kinds"],
      where: { kinds: decodeURIComponent(req.params.category) },
    });
    const where = {
      id: {
        [Op.in]: categoryId.map((v) => v.id),
      },
    };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      where.kinds = decodeURIComponent(req.params.category);
    }
    console.log("aa" + decodeURIComponent(req.params.category));
    const posts = await Post.findAll({
      where,
      limit: 5,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "email"],
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
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
