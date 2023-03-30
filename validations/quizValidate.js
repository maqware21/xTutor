const Joi = require('joi');

function validateQuiz(quiz) {
  const schema = Joi.object({
    lessons_uuid: Joi.string()
      .required()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
      .message('Invalid Lesson UUID'),
    mcqs: Joi.number().required(),
    written: Joi.number().required(),
  });

  const result = schema.validate(quiz);
  return result;
}
module.exports = { validateQuiz };
