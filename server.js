// Import the app variable from app.js

/////////////////
const fs = require('fs');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log('unhandleRejection !🧯 shutting down !');
  console.log(err.name, err.message);
  process.exit(1);
});
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional code to start your application can be placed here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
  console.log('unhandleRejection !🧯 shutting down !');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
