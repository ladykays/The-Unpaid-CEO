import express from "express";
import { PORT } from "./constants.js";
import { configureMiddleware } from "../../app.js";

export const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
