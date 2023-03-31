import Joi from "joi";

/**
 * Validates the admin sign up request
 * @param {Object} user
 * @returns {Object} Joi validation object
 */
export function validateAdminSignUpRequest(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20),
        password: Joi.string().required().min(5).max(15),
        email: Joi.string()
            .required()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] }
            }),
        phone_number: Joi.string().required().max(15),
        educational_level: Joi.string().required(),
        main_subjects: Joi.string().required()
    });

    const result = schema.validate(user);
    return result;
}

/**
 * Validates the admin login request
 * @param {Object} user
 * @returns {Object} Joi validation object
 */
export function validateAdminLogin(user) {
    const schema = Joi.object({
        password: Joi.string().required(),
        email: Joi.string()
            .required()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] }
            })
    });

    const result = schema.validate(user);
    return result;
}
