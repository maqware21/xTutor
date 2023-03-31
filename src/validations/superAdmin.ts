import Joi from "joi";

/**
 * Validates the super admin sign up request
 * @param {Object} admin
 * @returns {Object} Joi validation object
 */
export function validateSASignUp(admin) {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        role: Joi.string().required(),
        email: Joi.string()
            .required()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] }
            }),
        password: Joi.string().required().min(5).max(15)
    });

    const result = schema.validate(admin);
    return result;
}

/**
 * Validates the super admin login request
 * @param {Object} admin
 * @returns {Object} Joi validation object
 */
export function validateSALogin(admin) {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] }
            }),
        password: Joi.string().required().min(5).max(15)
    });

    const result = schema.validate(admin);
    return result;
}
