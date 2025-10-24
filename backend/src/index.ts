import "reflect-metadata";

import { app } from "./app";
import { seedInitialData } from "./bootstrap/seeds";
import { env } from "./config/env";
import { AppDataSource } from "./data-source";

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    await seedInitialData();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize application", error);
    process.exit(1);
  }
};

void bootstrap();
