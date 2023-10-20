import express from "express";
import photosRouter from "./photos";

const apiRouter = express.Router();

apiRouter.use(photosRouter);

export default apiRouter;
