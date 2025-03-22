"use strict";
class EnvParseError extends Error {
    constructor(message) {
        super(message);
        this.name = "EnvParseError";
    }
}

module.exports = {
    EnvParseError
}