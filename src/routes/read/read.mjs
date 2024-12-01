import express from "express";
import handlebars from 'handlebars';  // Import handlebars
import { db1, db2, db3 } from "../../databases.mjs";  // Import the databases
import  { getColumnByWord, isFloat, isNumber } from '../../helpers.mjs';
import { game } from "../../tables.mjs";
import { sql, eq, gte, lte, between } from "drizzle-orm"
import { decimal } from "drizzle-orm/mysql-core";
const router = express.Router();

// Register a custom helper to handle keys with spaces
handlebars.registerHelper('get', function (obj, key) {
  return obj[key];
});

// Handle dynamic parameters like "/read/:username"
router.get("/:username?", async (req, res) => {
  console.log('Session before access:', req.session); // Log session data before accessing

  const username = req.params.username || "Guest"; // Default to "Guest" if no username is provided
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
    // Fetch all games from the database
    const gameList = await db.select().from(game).execute();
    const hundList = gameList.slice(0, 100);    // Temporarily limit and show slice
    // console.log("Fetched game list:", gameList);

    // Render the "read" page with the fetched data
    res.render("pages/read", {
      layout: "crud-layout",
      title: `Read Game Data for ${username}`,
      username, // Pass the username to the template
      games: hundList, // Pass the fetched data to the template
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).send("Error fetching game data");
  }
});

router.get("/:username/:name/:str", async (req, res) => {
  const username = req.params.username || "Guest"; // Default to "Guest" if no username is provided
  const str = req.params.str;
  const fieldName = req.params.name
  var num;
  const lowName = fieldName.toLowerCase()
  console.log("Searching Activated");
  console.log(`${'%'+lowName+'%'} LIKE ${'%' + str + '%'}`);
  const selectedFieldSearch = getColumnByWord(lowName);

  try {
    var gameList;
    // Fetch all games from the database

    // Check if float for price
    if(isFloat(str)){
      num =  parseFloat(str);
      gameList = await db
      .select()
      .from(game)
      .where(eq(selectedFieldSearch, num)) 
      .execute();

      // Check if number for date
    }else if(isNumber(str)){
      num =  parseInt(str);
      gameList = await db
      .select()
      .from(game)
      .where(eq(selectedFieldSearch, num)) 
      .execute();

    }

    // Check String for developers and game
    else{

      gameList = await db.select()
      .from(game)
      .where(sql`${selectedFieldSearch} LIKE ${'%' + str + '%'}`)
      .execute();
    }

    var actualList = gameList;
    if (gameList.length > 100){
      const hundList = gameList.slice(0, 100);    // Temporarily limit and show slice
      actualList = hundList
    }

    // Render the "read" page with the fetched data
    res.render("pages/read", {
      layout: "crud-layout",
      title: `Read Game Data for ${username}`,
      username, // Pass the username to the template
      games: actualList, // Pass the fetched data to the template
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).send("Error fetching game data");
  }
});
router.post("/:username?", async (req, res) => {
  const username = req.params.username || "Guest"; // Default to "Guest" if no username is provided
  const fieldName = req.body.input_field_update; // Get the selected search field
  const searchName = req.body.search; // Get the search term entered by the user
  
  // Make sure the user didn't leave the search field empty (validation)
  if (!searchName || !fieldName) {
    return res.redirect(`/read/${username}`);  // Redirect back if validation fails
  }
  
  // Redirect to the search route with the correct parameters
  res.redirect(`/read/${username}/${fieldName}/${searchName}`);
});

export default router;
