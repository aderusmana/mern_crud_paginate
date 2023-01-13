import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import fileUpload from "express-fileupload";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(UserRoutes);

app.listen(5000, () => console.log("Server berjalan mulus.."));
