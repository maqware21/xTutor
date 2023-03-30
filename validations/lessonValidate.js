const Joi = require('joi');

function validateLesson(lesson) {
  const isLo4 =
    lesson?.lo4 || lesson?.lo4_media || lesson?.lo4_description ? true : false;
  const isLo5 =
    lesson?.lo5 || lesson?.lo5_media || lesson?.lo5_description ? true : false;

  const schema = Joi.object({
    title: Joi.string().required().max(50),
    educational_level: Joi.string().required(),
    subject: Joi.string().required(),
    topic: Joi.string().required(),
    quiz_type: Joi.string().required(),
    publish: Joi.boolean().required(),
    description: Joi.string().required(),
    lo1: Joi.string().required(),
    lo2: Joi.string().required(),
    lo3: Joi.string().required(),
    lo4: isLo4 ? Joi.string().required() : Joi.string().optional(),
    lo5: isLo5 ? Joi.string().required() : Joi.string().optional(),
    lo1_media: Joi.required(),
    lo2_media: Joi.required(),
    lo3_media: Joi.required(),
    lo4_media: isLo4 ? Joi.required() : Joi.optional(),
    lo5_media: isLo5 ? Joi.required() : Joi.optional(),
    lo1_description: Joi.string().required(),
    lo2_description: Joi.string().required(),
    lo3_description: Joi.string().required(),
    lo4_description: isLo4 ? Joi.string().required() : Joi.string().optional(),
    lo5_description: isLo5 ? Joi.string().required() : Joi.string().optional(),
  });

  const result = schema.validate(lesson);
  return result;
}
module.exports = { validateLesson };
