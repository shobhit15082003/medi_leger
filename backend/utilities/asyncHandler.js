// Takes an async fn and wraps it up in a Promise
const asyncHandler = (asyncFn) => {
    return (req, res, next) => {
        Promise.resolve(asyncFn(req, res, next))
        .catch((err) => next(err))
    }
}

export { asyncHandler }