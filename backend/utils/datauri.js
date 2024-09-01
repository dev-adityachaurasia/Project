import dataUri from 'datauri/parser.js'
import path from 'path'

let parser = new dataUri()

const datauri = (file)=>{
    const extName = path.extname(file.originalname).toString()
    return parser.format(extName,file.buffer).content;
}

export default datauri;