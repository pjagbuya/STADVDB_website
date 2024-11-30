import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import db from "../../db.mjs";  // Import the db connection (Drizzle ORM)
import { game } from "../../tables.mjs"; // Import the game model or schema from tables.mjs

const router = express.Router();

// Handle GET request to fetch data
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use drizzle ORM to query data from the 'c_game' table (assuming it's part of 'game' model)
    const results = await db.select().from(game);  // 'game' should be defined in your tables.mjs
    res.render("pages/delete", {
      layout: "crud-layout",
      title: "Delete Function",
      script_loc: "/common/js/delete.js",
      username: id,
      data: results,
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Failed to fetch data");
  }
});

// Handle POST request to delete data
router.post("/:id", async (req, res) => {
  const id = req.params.id; // Route parameter
  const { appID } = req.body; // Extract appID from request body

  console.log(appID); // For debugging

  // Validate appID
  if (!appID || isNaN(appID)) {
    return res.status(400).send("Invalid App ID");
  }

  try {
    // Use drizzle ORM to delete the record from the 'c_game' table
    const result = await db.deleteFrom(game).where(game.appid.eq(appID));  // Assuming 'appid' is a column in the 'game' table

    if (result.count > 0) {
      console.log(`Record with App ID ${appID} has been deleted.`);
      res.status(200).send("Record deleted successfully");
    } else {
      console.log(`No record found with App ID ${appID}.`);
      res.status(404).send("No record found");
    }
  } catch (err) {
    console.error("Error executing DELETE query:", err);
    res.status(500).send("Failed to delete record");
  }
});

export default router;
