import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, _res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarlt: false });
    next();
  } catch (err) {
    next(createHttpError(400, 'Bad request', { errors: err.details }));
  }
};
