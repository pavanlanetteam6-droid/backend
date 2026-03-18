const express = require("express")
const app = express();
const multer = require("multer");
const post = require("./model/post.model");
app.use(express.json());
const uploadFile = require("./service/service");


const upload = multer({ storage: multer.memoryStorage() })


app.post('/create-post', upload.single("image"), async (req, res) => {

    const result = await uploadFile(req.file.buffer)
     
    console.log(result)
    const newPost = await post.create({
        Image: result.url,
        caption: req.body.caption
    })

    return res.status(201).json({
        message: "Post created successfully",
        newPost
    })

})

app.get("/posts", async (req, res) => {

    const posts = await post.find()

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })

})

module.exports = app;