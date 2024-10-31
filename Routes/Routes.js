
const express = require("express");
const { addBlog, getAllBlogs, updateBlog, deleteBlog ,StarRatings} = require("../controller/blogController");
const {addComment, getComments} = require('../Socket/Socket');

const router = express.Router();

module.exports = (upload) => {

    router.post("/blogs", upload.fields([{ name: "img" }, { name: "video" }]), addBlog);
    router.get("/blogs", getAllBlogs);
    router.put("/blogs/:id", upload.fields([{ name: "img" }, { name: "video" }]), updateBlog);
    router.delete("/blogs/:id", deleteBlog);
    router.post("/comments", addComment);
    router.get("/comments", getComments);
    router.post("/submitRating", StarRatings);

    return router;
};
