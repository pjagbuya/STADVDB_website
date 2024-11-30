import Handlebars from 'handlebars';
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



router.post("/search", async (req, res) =>{
    const id = req.params.id;
    var gameList;
    var num;
    console.log(req.body)

    
    try{
      const fieldName = req.body.input_field_update;
      const txtField =  req.body.search;
      const lowName = fieldName.toLowerCase();
      const selectedFieldSearch = getColumnByWord(lowName);
      if(isFloat(txtField)){
        num =  parseFloat(txtField);
        gameList = await db
        .select()
        .from(game)
        .where(eq(selectedFieldSearch, num)).limit(100) 
        .execute();
  
        // Check if number for date
      }else if(isNumber(txtField)){
        num =  parseInt(txtField);
        gameList = await db
        .select()
        .from(game)
        .where(eq(selectedFieldSearch, num)) .limit(100)
        .execute();
  
      }
  
      // Check String for developers and game
      else{
  
        gameList = await db.select()
        .from(game)
        .where(sql`${selectedFieldSearch} LIKE ${'%' + txtField + '%'}`).limit(100)
        .execute();
      }

    }catch (error) {
      console.error("Error fetching game data:", error);
      res.status(500).send("Error fetching game data");
    }

    BigInt.prototype.toJSON = function () {
      return Number(this);
    };

    console.log(gameList)

    const response = {
      game: gameList
    }
    

    res.send(response);



  });

  export default router