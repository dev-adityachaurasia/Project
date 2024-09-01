import jwt from "jsonwebtoken"

const isAuthantication = (req,res,next) =>{
    try {
        const token = req.cookies.token
        if(!token){
            res.status(401).json({
                message:'User Is Not Valid',
                success:false
            })
        }
        const decode = jwt.verify(token,process.env.SECRET_KEY)

        req.id = decode.userId
        next()  
    } catch (error) {
        console.log(error)
    }
}

export default isAuthantication;