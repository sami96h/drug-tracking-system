const handleErrors = (err, req, res, next) => {
  // database and validation and auth errors
  

  if (err) {
    res.json({ msg: err.message });
  } else {
   

    next();
  }
};

module.exports = handleErrors;
