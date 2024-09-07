import { Post } from "../modules/post.model.js";
import { Comment } from "../modules/comment.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../modules/user.model.js";

export const newPost = async (req, res) => {
  try {
    const post = req.file;
    const { caption, member } = req.body;
    const author = await User.findById(req.id);
    let resizeImg = await sharp(post.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpg", { quality: 80 })
      .toBuffer();
    const creatUri = `data:/image/jpge;base64,${resizeImg.toString("base64")}`;
    const cloudResponce = await cloudinary.uploader.upload(creatUri);
    const createPost = await Post.create({
      author: author._id,
      post: cloudResponce.secure_url,
      caption,
    });
    author.posts.push(createPost._id);
    await author.save();
    if (member) {
      let memberUser = member.replace(/  +/g, " ").split(" ");
      memberUser.forEach(async (element) => {
        const user = await User.findOne({ username: element });
        if (user) {
          await Promise.all([
            Post.updateOne(
              { _id: createPost._id },
              { $push: { member: user._id } }
            ),
            User.updateOne(
              { _id: user._id },
              { $push: { membered: createPost._id } }
            ),
          ]);
        }
      });
    }
    await createPost.populate({
      path: "author".select("-password -private -"),
    });
    res.status(200).json({
      message: "Post Uploaded",
      success: true,
    });
  } catch (error) {
    console.log(erroe);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "profilePic,username" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "profilePic username" },
      });
      return res.json({
        allPost,
        success:true
      })
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const user = req.params.username
    const authorId = await User.findOne({username:user})
    const allPost = await Post.find({author:authorId._id})
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "profilePic,username" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "profilePic username" },
      });
      return res.json({
        allPost,
        success:true
      })
  } catch (error) {
    console.log(error);
  }
};

export const editPost = async (req, res) => {
  const { caption, member } = req.body;
  const postId = req.params.postid;
  post = await Post.findOne(postId);
  if (caption) post.caption = caption;
  if (member) {
    let memberUser = member.replace(/  +/g, " ").split(" ");
    memberUser.forEach(async (element) => {
      const user = await User.findOne({ username: element });
      if (user) {
        await Promise.all([
          Post.updateOne({ _id: post._id }, { $push: { member: user._id } }),
          User.updateOne({ _id: user._id }, { $push: { membered: post._id } }),
        ]);
      }
    });
  }
};

export const likePost = async (req,res) =>{
  const userId = req.id;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if(!post) return res.status(400).json({ message:"Post not found", success:false})
  await post.updateOne({$addToSet:{likes:userId}})
  post.save()
  return res.status(200).json({
    message:"Post Liked",
    success:true
  })
}

export const dislikePost = async (req,res) =>{
  const userId = req.id;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if(!post) return res.status(400).json({ message:"Post not found", success:false})
  await post.updateOne({$pull:{likes:userId}})
  post.save()
  return res.status(200).json({
    message:"Post Liked",
    success:true
  })
}

export const commentPost = async (req, res) => {
  try {
    const userId = req.id; // Get the user ID from the request
    const postId = req.params.id; // Get the post ID from the request params
    const { commentText } = req.body; // Get the comment text from the request body

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ message: "Post not found", success: false });

    // Create a comment object
    const comment = await Comment.create({
      author: userId, // The user making the comment
      comment: commentText, // The comment text
      post:post._id,
      createdAt: new Date(), // The creation time
    }).populate({
      path: "author",
      select: "profilePic, username", // Select relevant author fields
    });
    // Push the new comment to the comments array of the post
    post.comments.push(comment);

    // Save the updated post
    await post.save();

    return res.status(200).json({
      message: "Comment added successfully",
      success: true,
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request params

    // Find the post by its ID to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Find all comments related to this post, populate the author field
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }) // Sort by latest comment first
      .populate("author", "username profilePic") // Populate author info
      .exec();

    return res.status(200).json({
      message: "Comments retrieved successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from request parameters
    const userId = req.id; // Get user ID from the authenticated request

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Check if the current user is the owner of the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post", success: false });
    }

    // Delete the post from the Post collection
    await Post.findByIdAndDelete(postId);

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: postId });

    // Remove the post reference from the author's posts array
    await User.updateOne(
      { _id: userId },
      { $pull: { posts: postId } }
    );

    return res.status(200).json({
      message: "Post and associated comments deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const savePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from request parameters
    const userId = req.id; // Get the authenticated user's ID

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Find the user and check if the post is already saved
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if the post is already in the saved array using .includes()
    if (user.saved.includes(postId)) {
      // If the post is already saved, unsave it (remove from saved array)
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: postId } }, // Removes post ID from the saved array
        { new: true }
      );

      return res.status(200).json({
        message: "Post unsaved successfully",
        success: true,
      });
    } else {
      // If the post is not saved, save it (add to saved array)
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: postId } }, // Adds post ID to the saved array if not already there
        { new: true }
      );

      return res.status(200).json({
        message: "Post saved successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


