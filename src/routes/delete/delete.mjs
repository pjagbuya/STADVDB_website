import express from "express";
import mysql from "mysql2"; 
const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     // change accordingly
  database: 'mco1', // change accordingly
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).send("Database connection failed");
    }
    console.log('Connected to Database!');

    connection.query('SELECT * FROM c_game', (err, results, fields) => { //change c_game accordingly
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Failed to fetch data");
    }
    res.render("pages/delete", {
      layout: "crud-layout",
      title: "Delete Function",
      script_loc: "/common/js/delete.js",
      username: id,
      data: results,
    });

    });

  });
    //connection.end();
  });
  router.post("/:id", async (req, res) => {
    const id = req.params.id; // Route parameter
    const { appID } = req.body; // Extract appID from request body
    console.log(appID); //
    // Validate appID
    if (!appID || isNaN(appID)) {
        return res.status(400).send("Invalid App ID");
    }

    try {
        const result = connection.query("DELETE FROM c_game WHERE appid = ?", [appID]);

        if (result) {
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

export default router