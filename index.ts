import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import fs from "fs";
import * as jwt from "jsonwebtoken";
import { Createhtmlmd, titles, updatefiles } from "./notesutil";
import { authorizeinvidecodes, checkjwt } from "./auth";
import { signedtoken } from "./types";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'notes/'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: multer.memoryStorage() });

app.use(cookieParser());
app.use(checkjwt)

app.get("/", (req, res) => {
    res.render("index", {
        titles: titles
    })
});

app.get("/update", (req, res) => {
    updatefiles();
    res.redirect("/");
});

app.get("/create", (req, res) => {
    const jwt = req.cookies.jwt ?? null;
    if(jwt == null){
        return res.redirect("/");
    }
    res.render("create", {errorm : ""});
});

app.post("/upload", upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.render("create", {errorm : 'No file uploaded.'});

    const allowedTypes = ['text/markdown', 'text/x-markdown', 'text/plain','application/octet-stream'];
    if (!allowedTypes.includes(file.mimetype)) {
        return res.render("create", {errorm : '.md files only.'});
    }

    const filename = path.basename(file.originalname);
    const filepath = path.join(__dirname, 'notes', filename); // match your 'notes/' folder

    if (fs.existsSync(filepath)) {
        return res.render("create", {errorm : 'A file with that name already exists.'});
    }

    fs.writeFile(filepath, file.buffer, (err) => {
        if (err) {return res.render("create", {errorm : 'Error saving file.'});}
        updatefiles();
    });
    updatefiles();
    res.redirect("/");
});

app.get("/invite", (req, res) => {
    const invintestring = typeof req.query.invitecode == "string" ? req.query.invitecode : "";
    if(authorizeinvidecodes(invintestring)){
        const date = Date.now().toString();
        const validate:signedtoken = {date: date, signed: true};
        const token = jwt.sign(JSON.stringify(validate), process.env.JWT_SECRET!);
        res.cookie("jwt",token);
        return res.redirect("/");
    }
    return res.redirect("/");
});

app.get("/:title", async (req, res) => {
    const title = req.params.title;
    const htmlcontent = await Createhtmlmd(title);
    if (htmlcontent != null) {
        return res.render("document", {
            htmlcontent: htmlcontent
        })
    } res.redirect("/");
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
});