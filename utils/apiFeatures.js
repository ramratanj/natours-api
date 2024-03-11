const Tour = require('../models/tourModel');
class TourQueryBuilder {
  constructor() {
    this.query = Tour.find();
  }

  filter(queryObj) {
    this.query = this.query.find(queryObj);
    return this;
  }

  select(fields) {
    this.query = this.query.select(fields);
    return this;
  }

  sort(sortBy) {
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate(pageNumber, pageSize) {
    const skip = (pageNumber - 1) * pageSize;
    this.query = this.query.skip(skip).limit(pageSize);
    return this;
  }

  async execute() {
    return await this.query;
  }
}
module.exports = TourQueryBuilder;
