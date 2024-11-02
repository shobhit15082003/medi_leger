// Multer test
import upload from "../middlewares/multer_middleware.js";
import path from "path";

const multerTest = (app) => {
    app.set("view engine", "ejs")
    app.set("views", path.resolve("./"))

    app.get("/", (req, res) => {
        return res.render("./tests/multerTestPage")
    });

    app.post("/upload", upload.single("image"), (req, res) => {
        console.log("file uploaded successfully");
        return res.redirect("/");
    })
}

export default multerTest