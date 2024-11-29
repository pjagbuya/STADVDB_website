import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
  const id = req.params.id
    res.render("pages/delete", {
      layout: "crud-layout",
      title: "Delete Function",
      script_loc: "/common/js/delete.js",
      username: id
    });
  
  
  });
  router.post("/:id", (req, res) =>{
    const id = req.params.id
    res.send(`Hello we DELETE ${id}`)
  });

export default router