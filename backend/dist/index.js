"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const seeds_1 = require("./bootstrap/seeds");
const env_1 = require("./config/env");
const data_source_1 = require("./data-source");
const bootstrap = async () => {
    try {
        console.log("🔄 Initializing database connection...");
        console.log(`Database config: ${env_1.env.db.host}:${env_1.env.db.port}/${env_1.env.db.database}`);
        await data_source_1.AppDataSource.initialize();
        console.log("✅ Database connected successfully");
        await (0, seeds_1.seedInitialData)();
        console.log("✅ Initial data seeded");
        const host = "0.0.0.0"; // Escuchar en todas las interfaces
        app_1.app.listen(env_1.env.port, host, () => {
            console.log(`🚀 Server running on ${host}:${env_1.env.port}`);
            console.log(`   Environment: ${env_1.env.nodeEnv}`);
            console.log(`   Database: ${env_1.env.db.host}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to initialize application:", error);
        if (error instanceof Error) {
            console.error("   Error message:", error.message);
            console.error("   Error stack:", error.stack);
        }
        process.exit(1);
    }
};
void bootstrap();
//# sourceMappingURL=index.js.map