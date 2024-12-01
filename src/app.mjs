import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";

// Routes
import read from './routes/read/read.mjs';
import update from './routes/update/update.mjs';
import deleteFunc from './routes/delete/delete.mjs';
import create from './routes/create/create.mjs';

const app = express();
const PORT = "3000";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Overhead template for using hbs
import handlebars from "express-handlebars";
// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle cookies and session management
app.use(cookieParser("Hello world"));
app.use(
  session({
    secret: "pjagbuya1234", // Change this to a secure secret
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // Session expiration time (1 hour)
      secure: false, // Set to true if using HTTPS
    },
  })
);

// app attaches to the routes
app.use('/read', read);
app.use('/update', update);
app.use('/delete', deleteFunc);
app.use('/create', create);


// Set view engine and handlebars configuration
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
  })
);

// Correctly set the views directory path to be outside `src`
const viewsPath = path.resolve(__dirname, "../views");
app.set("views", viewsPath);

// Serve static files (CSS, JS, etc.)
app.use(express.static("public"));

// Route to display the homepage and register form
app.get("/", (req, res) => {
  res.render("pages/home", {
    layout: "home-layout",
    title: "Welcome to STADVDB MCO2",
  });
});

// Route to handle registration and username submission
app.post("/", (req, res) => {
  const { username } = req.body;
  // Store username in session
  req.session.username = username;
  res.redirect(`/selectNode`);
  console.log(req.session); // Check if the session contains the `node` field
});

// Route to display node selection page
app.get("/selectNode", (req, res) => {
  res.render("pages/selectNode", {
    layout: "home-layout",
    title: "Select Node",
  });
});

// Route to handle node selection
app.post("/selectNode", (req, res) => {
  const { selectedNode } = req.body;
  console.log("Selected Node:", selectedNode);  // Debugging line
  
  if (selectedNode) {
    // Log session before setting node
    console.log("Session before setting node:", req.session);

    req.session.node = selectedNode;

    // Log session after setting node
    console.log("Session after setting node:", req.session); // Debugging session

    res.redirect(`/home_success`);
  } else {
    console.log("No node selected.");
    res.status(400).send("Node selection is required");
  }
});

// Route to show home success page after node selection
app.get("/home_success", (req, res) => {
  const username = req.session.username;
  const selectedNode = req.session.node;

  console.log("Selected node in session on success:", selectedNode);  // Debugging session data

  res.render("pages/home_success", {
    layout: "home-layout",
    title: `Welcome ${username}`,
    username,
    selectedNode, // Include the selected node in the response
  });
});

// Route to show a page based on dynamic `id`
app.get("/:id", (req, res) => {
  const id = req.params.id;
  res.render("pages/home_success", {
    layout: "home-layout",
    title: `Welcome ${id}`,
    username: id,
  });
});

// Routes for CRUD operations (Ensure that session data is used here)
app.use('/read', read);
app.use('/update', update);
app.use('/delete', deleteFunc);
app.use('/create', create);

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
