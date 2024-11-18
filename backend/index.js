const express = require("express");
const connectDB = require('./db/db'); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to the database
connectDB();

const PORT = 3000;

const SECRET_KEY = "myScretKey";

let users = [];

const generateToken = (user) => {
    return jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: '1h'})
};

const tokenMiddleware = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token"});
    }
}

// Implement signup
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find((user) => user.username == username);
    if(userExists){
        return res.status(400).json({ message: "User Already Exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword}
    users.push(newUser);
    res.status(201).json({ message: "User Created Successfully"});
})

// Sign In
app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => user.username == username);
    if(!user){
        return res.status(400).json({ message: "User Does not exist"});
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
        return res.status(400).json({ message: "Invalid password"})
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Login Succesful", token})
});

app.get("/protected", tokenMiddleware, (req, res) => {
    return res.status(400).json({ message: `Hello ${req.user} from main page`});
})

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, (req, res) => {
    console.log(`App Running on http://localhost:${PORT}`);
})