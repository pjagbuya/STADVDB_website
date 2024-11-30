import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";


//Routes
import read from './routes/read/read.mjs';
import update from './routes/update/update.mjs';
import deleteFunc from './routes/delete/delete.mjs';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = "8080"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Overhead template for using hbs
import handlebars from "express-handlebars";



// app attaches to the routes
app.use('/read', read);

app.use('/update', update);

app.use('/delete', deleteFunc);



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
app.post("/", (req, res) =>{
  
  res.redirect(`/${req.body.username}`)
});
app.get("/:id", (req, res) => {
  const id = req.params.id;
  res.render("pages/home_success", {
    layout: "home-layout",
    title: `Welcome ${id}`,
    username: id
  });
});


app.get("/:id", (req, res) => {
  res.render("pages/home_success", {
    layout: "home-layout",
    title: `Welcome ${req.body.username}`,
    username: req.params.id
  });
});



// Add error handling to app.listen
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Catch errors like EADDRINUSE
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
    } else {
        console.error('An unexpected error occurred:', err);
    }
});


export default app;

