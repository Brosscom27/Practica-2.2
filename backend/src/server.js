import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { seedDefaults } from './utils/seedDefaults.js';

dotenv.config();

const port = process.env.PORT || 4000;

connectDB()
  .then(async () => {
    await seedDefaults();
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database', error);
    process.exit(1);
  });
