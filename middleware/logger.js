//middleware function
async function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl} at ${new Date()}`);

  next();
}

module.exports = logger;
