
import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id
    res.render("pages/read", {
      layout: "crud-layout",
      title: "Read Function",
      script_loc: "/common/js/read.js",
      username: id
    });
  
  
  });
router.post("/:id", (req, res) =>{
    const id = req.params.id
console.log("Reached POST request");

});

export default router