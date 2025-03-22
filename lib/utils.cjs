"use strict";

const typeMap = {
    "string": (value) => String(value),
    "number": (value) => Number(value),
    "array": (value) => JSON.parse(value),
    "object": (value) => JSON.parse(value),
    "date": (value) => new Date(value),
    "bigint": (value) => BigInt(value),
    "boolean": (value) => Boolean(value),
    "symbol": (value) => Symbol(value)
};

module.exports = {
    typeMap
};