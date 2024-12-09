import multer from 'multer';
import path from 'path';
// Set storage engine for multer
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Specify the folder to store images
    },
    filename: (req, file, cb) => {
        const userId = req.user.id? req.user.id: 'unknown-user'; // Fallback if user ID is not found
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); // Get file extension
        // Custom filename: userId-timestamp.extension
        const customFileName = `${userId}-${timestamp}${fileExtension}`;
         
        cb(null, customFileName);

    }
});



// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed extensions
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};

// Set multer options
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
    fileFilter
});

export default upload;
