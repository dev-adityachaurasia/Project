import { sigiInSchema } from "../config/joi.js";
import { User } from "../modules/user.model.js";
import bcrypt from "bcrypt";
import { decodeToken, getToken } from "../utils/generate-token.js";
import cloudinary from "../utils/cloudinary.js";
import datauri from "../utils/datauri.js";

export const signIn = async (req, res) => {
  try {
    const { username, email, password, branch, college, year } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "something Went Wrong Try Again",
        success: false,
      });
    }
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = await User.create({
          username,
          email,
          password: hash,
          branch,
          college,
          year,
        });
        const token = getToken(user);
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSit: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
          })
          .json({
            message: "Created Account Successfully",
            success: true,
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email:email});
    if (!user) {
      res.status(401).json({
        message: "Inval Email Or Password",
        success: false,
      });
    }
    const verify = bcrypt.compare(password,user.password)
    if (!verify) {
      res.status(401).json({
        message: "Inval Email Or Password",
        success: false,
      });
    }
    const token = getToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSit: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.username;
    const user = await User.findOne({ username: userId }).select(
      "-password -private"
    );
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { bio, email, username, branch, college, year } = req.body;
    const profilePic = req.file
    const token = req.cookies.token;
    const userId = decodeToken(token);
    const user = await User.findById(userId);
    if (username) {
      const search = await User.findOne({ username: username });
      if (search) {
        return res.status(400).json({
          message: "Username Taken Already",
          success: false,
        });
      }
      user.username = username;
    }
    if (email) {
      const search = await User.findOne({ email: email });
      if (search) {
        return res.status(400).json({
          message: "Email Taken Already",
          success: false,
        });
      }
      user.email = email;
    }
    let cloudResponce;
    if (profilePic) {
     const fileUri = datauri(profilePic)
     cloudResponce = await cloudinary.uploader.upload(fileUri);
     user.profilePic = cloudResponce.secure_url;
    }
    if (bio) {
      console.log("BIO")
      user.bio = bio;
    }
    if (branch) user.branch = branch;
    if (college) user.college = college;
    if (year) user.year = year;
    await user.save();
    return res.status(200).json({
      message: "Update Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const suggetUser = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const suggestUser = await User.find([
      { college: { $eq: user.college } },
      { branch: { $eq: user.branch } },
      { year: { $eq: user.year } },
    ]);
    res.status(200).json({
      suggestUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const userId = await User.findById(req.id);
    const getFollower = req.params.username;
    if (userId.username === getFollower) {
      res.status(401).json({
        message: "Connot follow of Unfollow Self",
        success: false,
      });
    }
    const followedId = await User.find({ username: getFollower });
    if (!userId || !followedId) {
      res.status(401).json({
        message: "User Not Found",
        success: false,
      });
    }
    const isFollowing = await userId.following.includes(followedId._id);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: userId._id },
          { $pull: { following: followedId._id } }
        ),
        User.updateOne(
          { _id: followedId._id },
          { $pull: { follower: userId._id } }
        ),
      ]);
    } else {
      await Promise.all([
        User.updateOne(
          { _id: userId._id },
          { $push: { following: followedId._id } }
        ),
        User.updateOne(
          { _id: followedId._id },
          { $push: { follower: userId._id } }
        ),
      ]);
    }
  } catch (error) {
    console.log(error);
  }
};
