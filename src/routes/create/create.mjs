
import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import db from "../../db.mjs";
import  { getColumnByWord, isFloat, isNumber }from '../../helpers.mjs';
import { game } from "../../tables.mjs";
import { sql, eq, gte, lte, between } from "drizzle-orm"
import { decimal } from "drizzle-orm/mysql-core";
const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id

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