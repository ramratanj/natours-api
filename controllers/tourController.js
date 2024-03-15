const Tour = require('./../models/tourModel');
const TourQueryBuilder = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const { page = 1, sort, limit = 10, fields, ...queryObj } = req.query;

  // Ensure that TourQueryBuilder and its methods are properly defined
  const tourQuery = new TourQueryBuilder()
    .filter(queryObj)
    .select(fields)
    .sort(sort)
    .paginate(parseInt(page), parseInt(limit));

  const tours = await tourQuery.execute();

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body); // Use await to properly handle asynchronous operation
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found that id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // group all documents
        numTours: { $sum: 1 }, // count number of documents
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingAverage' }, // Calculate average rating
        minPrice: { $min: '$price' }, // Calculate minimum price
        maxPrice: { $max: '$price' }, // Calculate maximum price
        avgPrice: { $avg: '$price' }, // Calculate average price
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  // Send response with the retrieved stats
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$startDates' }, tourName: '$name' },
        numTourStarts: { $sum: 1 },
      },
    },
    {
      $addFields: {
        month: '$_id.month',
        tourName: '$_id.tourName',
      },
    },
    {
      $group: {
        _id: '$month',
        tourName: { $first: '$tourName' },
        numTourStarts: { $sum: '$numTourStarts' },
      },
    },
    {
      $sort: { numTourStarts: -1 }, // Sort by number of tours in descending order
    },
    {
      $group: {
        _id: null,
        mostToursYear: { $first: '$_id' },
        maxTours: { $first: '$numTourStarts' },
        tourName: { $first: '$tourName' }, // Tour name with most tours
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default _id field
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
