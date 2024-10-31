
const BlogGenre = require('../Schema/Schema');
const cloudinary = require('cloudinary').v2;

const addBlog = async (req, res) => {
    try {
        const { title, category,simpledescription, description, star, details, back} = req.body;

     
        const imgFile = req.files.img[0];
        const videoFile = req.files.video[0];

        const imageUpload = await cloudinary.uploader.upload(imgFile.path);
        const videoUpload = await cloudinary.uploader.upload(videoFile.path);

        const newBlog = new BlogGenre({
            title,
            category,
            simpledescription,
            description,
            img: imageUpload.secure_url,
            back: back,
            video: videoUpload.secure_url,
            star,
            details: {
                genre: details.genre,
                createdBy: details.createdBy,
                directedBy: details.directedBy,
                starring: details.starring,
                musicBy: details.musicBy,
                countryOfOrigin: details.countryOfOrigin,
                originalLanguage: details.originalLanguage,
                seasons: details.seasons,
                numberOfEpisodes: details.numberOfEpisodes,
            },
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogGenre.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        

        const { id } = req.params;
        const { title, category,simpledescription, description, star, details , back} = req.body;


        let imgUrl, videoUrl;

        if (req.files) {
       
            if (req.files.img && req.files.img.length > 0) {
                const imgFile = req.files.img[0];
                const imageUpload = await cloudinary.uploader.upload(imgFile.path);
                imgUrl = imageUpload.secure_url;
            }
    
            if (req.files.video && req.files.video.length > 0) {
                const videoFile = req.files.video[0];
                const videoUpload = await cloudinary.uploader.upload(videoFile.path);
                videoUrl = videoUpload.secure_url;
            }
        }

     
        const updatedBlog = await BlogGenre.findByIdAndUpdate(
            id,
            {
                title,
                category,
                simpledescription,
                description,
                back,
                img: imgUrl || undefined, 
                video: videoUrl || undefined, 
                star,
                details,
            },
            { new: true } 
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await BlogGenre.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const StarRatings =async (req,res)=>
{
    const { blogId, rating } = req.body;

    try {
 
      const blog = await BlogGenre.findById(blogId);
      if (!blog) return res.status(404).send("Blog not found");
  

      const currentStar = parseFloat(blog.star); 
      const totalRatings = blog.ratings.length + 1;
      

      const newAverage = ((currentStar * (totalRatings - 1)) + rating) / totalRatings;
  
  
      blog.star = newAverage.toFixed(1); 
  
   
      await blog.save();
  
      res.status(200).json({ message: "Rating submitted", newStar: blog.star });
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    StarRatings,
};
