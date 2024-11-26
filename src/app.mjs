import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Overhead template for using hbs
import handlebars from "express-handlebars";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
  })
);

// Correctly set the views directory path to be outside `src`
const viewsPath = path.resolve(__dirname, "../views");
console.log("Views Path: ", viewsPath);
app.set("views", viewsPath);

app.use(express.static("public"));

// Overhead template for using sessions
app.use(cookieParser("Hello world"));
app.use(
  session({
    secret: "pjagbuya1234",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.render("pages/home", {
    layout: "home-layout",
    title: "Welcome to STADVDB MCO2",
  });
});

app.get("/register", (req, res) => {
  res.render("pages/register", {
    layout: "home-layout",
    title: "Register",
  });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("User registered:", { username, password });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("pages/login", {
    layout: "home-layout",
    title: "Login",
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("User login attempt:", { username, password });
  res.redirect("/");
});

export default app;

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});