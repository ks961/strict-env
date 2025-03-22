"use strict";
class ParseEnvError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParseEnvError";
    }
}

module.exports = {
    ParseEnvError
}