import { Result } from "../modules/result.model.js";
import { User } from "../modules/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import datauri from "../utils/datauri.js";

export const uploadResult = async (req, res) => {
  try {
    const userId = req.id;
    const { year, branch, kt, sem, reval } = req.body;
    const result = req.file;
    const admin = await User.findById(userId);
    if (admin.isadmin) {
      const dataUri = datauri(result);
      let cloudResponce = await cloudinary.uploader.upload(dataUri, {
        resource_type: "auto",
      });
      const uploadResult = await Result.create({
        author: userId,
        result: cloudResponce.secure_url,
        title: `${branch} result ${year}`,
        year,
        sem,
        branch,
        kt,
        reval,
        cloudpostname: cloudResponce.display_name,
      });

      return res.status(200).json({
        message: "Result uploaded",
        success: true,
        uploadResult
      });
    }
    return res.status(500).json({
      message: "you are not admin",
      success: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editResult = async (req,res) =>{
  try {
    const userId = req.id;
    const { year, branch, kt, sem, reval } = req.body;
    const resultId = req.params.id
    const admin = await User.findById(userId);
    const result = await Result.findById(resultId);
    console.log(result.year)
    if (admin.isadmin) {
      if(year) result.year = year
      if(branch) result.branch = branch
      if(sem) result.sem = sem
      if(kt) result.kt = kt
      if(reval) result.reval = reval
      await result.save()
      return res.status(200).json({
        message:"Done Update",
        success:true
      })
    }
    return res.status(400).json({
      message:"you are not admine",
      success:false
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteResult = async (req,res) =>{
  try {
    const userId = req.id;
    const resultId = req.params.id
    const admin = await User.findById(userId);
    const result = await Result.findByIdAndDelete(resultId);
    if (admin.isadmin) {
      cloudinary.api.delete_all_resources([result.cloudpostname])
      result.cloudpostname
      return res.status(200).json({
        message:"Delete Result",
        success:true
      })
    }
    return res.status(200).json({
      message: "you are not admin",
      success: false,
    })
  } catch (error) {
    console.log(error)
  }
}
