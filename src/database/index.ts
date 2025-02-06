import "dotenv/config";
import { DataSource } from "typeorm";

const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    database: "MyPDFVault",
    username: "root",
    password: "123456",
    synchronize: true,
    logging: true,
    entities: [
        process.env.NODE_ENV
            ? "./dist/database/entities/*.js"
            : "./src/database/entities/*.ts",
    ],
    subscribers: [],
    migrations: [
        process.env.NODE_ENV
            ? "./dist/database/migrations/*.js"
            : "./src/database/migrations/*.ts",
    ],
});

export { appDataSource };
