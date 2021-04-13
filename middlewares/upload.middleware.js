module.export.setUploadPath = (uploadPath) => {
    return (req, res, next) => {
        req.uploadPath = uploadPath;
        next();
    }
};