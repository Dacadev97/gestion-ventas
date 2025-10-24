import "reflect-metadata";

import { app } from "./app";
import { seedInitialData } from "./bootstrap/seeds";
import { env } from "./config/env";
import { AppDataSource } from "./data-source";

const bootstrap = async () => {
  try {
    console.log("🔄 Initializing database connection...");
    console.log(`Database config: ${env.db.host}:${env.db.port}/${env.db.database}`);
    
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");
    
    await seedInitialData();
    console.log("✅ Initial data seeded");

    const host = "0.0.0.0"; // Escuchar en todas las interfaces
    app.listen(env.port, host, () => {
      console.log(`🚀 Server running on ${host}:${env.port}`);
      console.log(`   Environment: ${env.nodeEnv}`);
      console.log(`   Database: ${env.db.host}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    process.exit(1);
  }
};

void bootstrap();
