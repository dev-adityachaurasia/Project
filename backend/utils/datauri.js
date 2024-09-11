import dataUri from "datauri/parser.js";
import path from "path";  

let parser = new dataUri();

const datauri = (file) => {
  if(file.originalname){
    const extName = path.extname(file.originalname);
    return parser.format(extName, file.buffer).content;
  }else{
    return parser.format("jpg",file).content;
  }
};

export default datauri;
