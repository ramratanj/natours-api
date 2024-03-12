const express = require('express');
const tourController = require('./../controllers/tourController');
const catchAsync = require('./../utils/catchAsync');
const router = express.Router();

//router.param('id', tourController.checkID);
router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
