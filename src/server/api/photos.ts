import express from "express";

const photosRouter = express.Router();

photosRouter.get("/photos", async (req, res) => {
  res.status(200).json({ r: req.path, d: "hello" });
});

export default photosRouter;
