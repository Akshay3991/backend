import mongoose from "mongoose";
import express from "express";
// import { Blog } from "./Todo.js";
import { User } from "./Todo.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"


// mongoose.connect("mongodb://0.0.0.0:27017", { dbName: "backend", autoIndex: false })
// mongoose.connect("mongodb://0.0.0.0:27017/blog", { autoIndex: false })
//     .then(() => console.log('Database connected')).catch((e) => {
//         console.log(e);

//     })
mongoose.connect("mongodb://0.0.0.0:27017/User", { autoIndex: false })
    .then(() => console.log('Database connected')).catch((e) => {
        console.log(e);

    })
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "askdjdsddjsjjf")
        // console.log(decoded);

        req.user = await User.findById(decoded.id)
        next();
    }
    else {

        res.redirect("/login")
    }

}
app.get("/", isAuthenticated, (req, res) => {
    // console.log(req.user);
    res.render("logout", { name: req.user.name })
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) return res.redirect("/register")
    // const isMatch = user.password === password;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { email, message: "Incorrect Password" })
    const token = jwt.sign({ id: user._id }, "askdjdsddjsjjf")
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    })
    res.redirect("/")
})
app.post("/register", async (req, res) => {
    // console.log(req.body);
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
        return res.redirect("/login");

    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    })
    const token = jwt.sign({ id: user._id }, "askdjdsddjsjjf")
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    })
    res.redirect("/")
})
app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.redirect("/")
})

// app.get('/', (req, res) => {
//     const blog = new Blog({ title: 'hey First blog', author: "Akshay", body: "first blog body" })
//     blog.save()
//     res.send('Hello World!')
// })
// app.get('/add', async (req, res) => {
//     await Blog.create({ title: 'akshay', author: "Akshay", body: "akshay bodybuilder hai" })
//     // .then(() => {
//     //     res.send("Nice")
//     // })
//     res.send('Hello World!')

// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})