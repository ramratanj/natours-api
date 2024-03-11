// const fs = require('fs');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const Tour = require('./../../models/tourModel');
// const app = require('../../app');

// dotenv.config({ path: './config.env' });

// mongoose
//   .connect(process.env.DATABASE_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
// );

// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Data successfully loaded');
//   } catch (err) {
//     console.log(err);
//     process.exit();
//   }
// };

// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     console.log('Data successfully deleted');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }
// console.log(process.argv);
