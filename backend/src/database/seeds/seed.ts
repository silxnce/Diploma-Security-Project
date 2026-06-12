import 'dotenv/config';
import { AppDataSource } from '../database.config';
import { seedAdmin } from './admin.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();

    await seedAdmin(AppDataSource);

    await AppDataSource.destroy();

    console.log('Seeding успішно завершено');
  } catch (error) {
    console.error('Seeding перервано:', error);
    process.exit(1);
  }
}

void runSeeds();
