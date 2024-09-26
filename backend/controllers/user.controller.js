import { User } from "../modules/user.model.js";
import bcrypt from "bcrypt";
import { decodeToken, getToken } from "../utils/generate-token.js";
import cloudinary from "../utils/cloudinary.js";
import datauri from "../utils/datauri.js";
import isEmail from "../middlewares/isEmail.js";
import { loginSchema, sigiInSchema } from "../config/joi.js";

export const signIn = async (req, res) => {
  try {
    const { username, email, name, password, branch, district, college, year } =
      req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "Already have account",
        success: false,
      });
    }
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = await User.create({
          username,
          email,
          name,
          password: hash,
          district,
          college,
          branch,
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
    const { value, password } = req.body;
    let user;
    if (isEmail(value)) {
      user = await User.findOne({ email: value });
    } else {
      user = await User.findOne({ username: value });
    }
    if (!user) {
      return res.status(401).json({
        message: "Inval Email Or Password",
        success: false,
      });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({
        message: "Inval Email Or Password",
        success: false,
      });
    }
    const token = getToken(user);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSit: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (_, res) => {
  try {
    return res.clearCookie("token").json({
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
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { bio, email, username, branch, college, year } = req.body;
    const profilePic = req.file;
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
    if (profilePic) {
      const fileUri = datauri(profilePic);
      let cloudResponce = await cloudinary.uploader.upload(fileUri);
      user.profilePic = cloudResponce.url;
    }
    if (bio) {
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
    const suggestUser = await User.find({
      $and: [
        { username: { $ne: user.username } },
        {
          $or: [
            { year: { $eq: user.year } },
            { college: { $eq: user.college } },
            { branch: { $eq: user.branch } },
          ],
        },
      ],
    });
    return res.status(200).json({
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
      return res.status(401).json({
        message: "Connot follow of Unfollow Self",
        success: false,
      });
    }
    const followedId = await User.findOne({ username: getFollower });

    if (!userId || !followedId) {
      return res.status(401).json({
        message: "User Not Found",
        success: false,
      });
    }
    const isFollowing = await userId.following.includes(
      followedId._id.toString()
    );
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
      return res.status(200).json({
        message: "Unfollowed",
        success: true,
      });
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
      return res.status(200).json({
        message: "Followed",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { value } = req.body;
    let user;
    if (isEmail(value)) {
      user = await User.findOne({ email: value }).select(" name email ");
    } else {
      user = await User.findOne({ username: value }).select(" name email ");
    }
    if (user) {
      return res.status(200).json({
        message: " Taken Already",
        isTaken: true,
        user,
      });
    }
    return res.status(200).json({
      message: "Username Available",
      isTaken: false,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { password, username } = req.body;
    console.log(password, username);
    const userId = await User.findById(username);
    if (!userId) {
      return res.status(401).json({
        message: "User Not Found",
        success: false,
      });
    }
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        userId.password = hash;
        await userId.save();
        return res.status(200).json({
          message: "Password Updated Successfully",
          success: true,
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
