import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import { db1, db2, db3 } from "../../databases.mjs";  // Import the databases
import { game } from "../../tables.mjs"; // Import the game model or schema from tables.mjs
import { deleteGame } from "../../GameSync.mjs";

const router = express.Router();

// Handle GET request to fetch data
router.get("/:id", async (req, res) => {
      const id = req.params.id;
      const selectedNode = req.session.node; // Get the selected node from session
      // Dynamically select the database based on the selected node
      let db;
      if (selectedNode === "Node1") {
        db = db1;
      } else if (selectedNode === "Node2") {
        db = db2;
      } else if (selectedNode === "Node3") {
        db = db3;
      } else {
        db = db2;  // Default to db2 if no node is selected
      }
    

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

// POST route to delete a game
router.post("/:id", async (req, res) => {
  const { appID } = req.body;  // Extract the appID to identify which game to delete
  const selectedNode = req.session.node; // Get the selected node from session
  // Dynamically select the database based on the selected node
  let db;
  if (selectedNode === "Node1") {
    db = db1;
  } else if (selectedNode === "Node2") {
    db = db2;
  } else if (selectedNode === "Node3") {
    db = db3;
  } else {
    db = db2;  // Default to db2 if no node is selected
  }

  try {
    const gameData = await db.select().from(game).where(eq(game.appid, appID)).execute();
    if (!gameData.length) {
      return res.status(404).send("Game not found.");
    }

    // Delete the game from Node 1 and the relevant partitioned node
    await deleteGame(appID, gameData[0].releaseDate);

    res.status(200).send("Game deleted successfully.");
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).send("Error deleting game.");
  }
});

export default router;
