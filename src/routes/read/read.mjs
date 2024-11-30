import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import db from "../../db.mjs";
import { game } from "../../tables.mjs";

const router = express.Router();

// Register a custom helper to handle keys with spaces
handlebars.registerHelper('get', function (obj, key) {
  return obj[key];
});

// Handle dynamic parameters like "/read/:username"
router.get("/:username?", async (req, res) => {
  const username = req.params.username || "Guest"; // Default to "Guest" if no username is provided
  console.log("Game table definition:", game);
  try {
    // Fetch all games from the database
    const gameList = await db.select().from(game).execute();
    console.log("Fetched game list:", gameList);

    // Render the "read" page with the fetched data
    res.render("pages/read", {
      layout: "home-layout",
      title: `Read Game Data for ${username}`,
      username, // Pass the username to the template
      games: gameList, // Pass the fetched data to the template
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).send("Error fetching game data");
  }
});

export default router;
