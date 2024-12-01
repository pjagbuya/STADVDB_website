
import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import { db1, db2, db3 } from "../../databases.mjs";  // Import the databases
import  { getColumnByWord, isFloat, isNumber }from '../../helpers.mjs';
import { game } from "../../tables.mjs";
import { sql, eq, gte, lte, between } from "drizzle-orm"
import { decimal } from "drizzle-orm/mysql-core";
const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id
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
  
    try{
      const gameList = await db.select().from(game).limit(100).execute();

     
      res.render("pages/update", {
        layout: "crud-layout",
        title: "Update Function",
        script_loc: "/common/js/update.js",
        username: id,
        games: gameList
      });
    }catch (error) {
      console.error("Error fetching game data:", error);
      res.status(500).send("Error fetching game data");
    }

  
  
  });
  router.post("/:id", (req, res) =>{
    const id = req.params.id
    res.send(`Hello we UPDATE ${id}`);
  });

  export default router