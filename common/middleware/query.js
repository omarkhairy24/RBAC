const index = (req, res, next) => {
  try {
    let { page, limit, search } = req.query;

    req.pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 300,
      skip: page ? (parseInt(page) - 1) * parseInt(limit) : 0,
    };

    if (search) {
      search = search.startsWith(' ') ? search.replace(' ', '') : search;
    }

    req.search = search;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = index;