"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const seeds_1 = require("./bootstrap/seeds");
const env_1 = require("./config/env");
const data_source_1 = require("./data-source");
const bootstrap = async () => {
    try {
        await data_source_1.AppDataSource.initialize();
        await (0, seeds_1.seedInitialData)();
        app_1.app.listen(env_1.env.port, () => {
            console.log(`🚀 Server running on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to initialize application", error);
        process.exit(1);
    }
};
void bootstrap();
//# sourceMappingURL=index.js.map