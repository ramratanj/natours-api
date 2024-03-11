const Tour = require('./../models/tourModel');
const TourQueryBuilder = require('./../utils/apiFeatures');
exports.getAllTours = async (req, res) => {
  try {
    const { page = 1, sort, limit = 10, fields, ...queryObj } = req.query;

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
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); // Use await to properly handle asynchronous operation
    res.status(201).json({
      // Use status code 201 for successful creation
      status: 'success',
      data: {
        tour: newTour, // Send the newly created tour in the response
      },
    });
  } catch (err) {
    res.status(400).json({
      // Use status code 400 for bad request
      status: 'failed',
      message: err.message, // Send the error message in the response
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({}); // Corrected to use res.status()
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    // Handle errors
    console.error('Error:', err);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
