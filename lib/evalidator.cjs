"use strict";
const { 
    ObjectValidator, 
    ValidationError,
    ObjectValidationError, 
} = require("@d3vtool/validator");

function eValidator(
    validators,
    envMap
) {
    try {
        if(validators instanceof ObjectValidator) {
            validators.validate(envMap);
        } else if(typeof validators === "object" && 'hasOwnProperty' in validators) {
            for(const key in validators) {
                const errors = validators[key].validateSafely(envMap[key]);
                if(errors.length > 0) {
                    throw new ObjectValidationError(key, errors[0]);
                }
            }
        } else {
            throw new ValidationError("Invalid validator object was passed.");
        }
    } catch(err) {
        if(err instanceof ValidationError) {
            throw new ValidationError(err.message);
        } else if(err instanceof ObjectValidationError) {
            throw new ValidationError(`For key '${err.key}': ${err.message}'`)
        } else {                
            throw new ValidationError("Something went wrong, please re-check your validator.");
        }
    }
}

module.exports = {
    eValidator
};