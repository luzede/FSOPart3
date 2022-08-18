
const errorHandler = (err, req, res, next) => {
    console.log(err.name);
    console.log(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(err);
}

module.exports = errorHandler;