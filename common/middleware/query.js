const index = (req, res, next) => {
  try {
    let { page, limit } = req.query;

    req.pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 300,
      skip: page ? (parseInt(page) - 1) * parseInt(limit) : 0,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = index;