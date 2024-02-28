import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb-call back
    cb(null, "./public/temp"); // file kaha pr rakhna hai
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); //this will add an random char's at the end of file
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

// hoga kesa 

/* app.post('/register' (route/path), middleware (storage),controller); agar kisi route pr file ayegi meri to usko "Storage mai save kr do" */
