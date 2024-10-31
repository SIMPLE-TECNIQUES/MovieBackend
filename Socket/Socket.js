const BlogGenre = require("../Schema/Schema"); 


const addComment = async (req, res) => {
    const { blogId, comment } = req.body;

    try {

        await BlogGenre.findByIdAndUpdate(blogId, { $push: { ratings: { comment } } });
        res.status(200).json({ message: "Comment added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};

const getComments = async (req, res) => {
    const { blogId } = req.query;

    try {
        const blog = await BlogGenre.findById(blogId);
      
        if (blog && Array.isArray(blog.ratings)) {
            res.status(200).json(blog.ratings);
        } else {
            res.status(200).json([]); 
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error });
    }
};


module.exports = { addComment, getComments };
