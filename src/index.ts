import "dotenv/config";
import "reflect-metadata";
import "express-async-errors";
import express from "express";
import { customerRoute } from "./routes/customerRoute";
import { errorPrevent } from "./middlewares/errorPrevent";
import { appDataSource } from "./database";
import { loginCustomerRoute } from "./routes/loginCustomerRoute";
const app = express();

app.use(express.json());
app.use(customerRoute);
app.use(loginCustomerRoute);
app.use(errorPrevent);

appDataSource
    .initialize()
    .then(() => {
        app.listen(3333, () => {
            console.log("Server listens on port 3333");
        });
    })
    .catch((err) => {
        console.log("Something was wrong with the database" + err.stack);
    });
