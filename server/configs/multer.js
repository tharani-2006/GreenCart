import multer from "multer"

//multer setup
export const upload = multer({storage:multer.diskStorage({})})