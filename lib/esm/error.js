"use strict";
export class ParseEnvError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParseEnvError";
    }
}