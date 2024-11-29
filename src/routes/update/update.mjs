
import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
    const id = req.params.id
    res.render("pages/update", {
      layout: "crud-layout",
      title: "Update Function",
      script_loc: "/common/js/update.js",
      username: id
    });
  
  
  });
  router.post("/:id", (req, res) =>{
    const id = req.params.id
    res.send(`Hello we UPDATE ${id}`);
  });

  export default router