"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { setup } = require("./index.cjs");

/**
 * Sets up environment configuration by loading environment files.
 * If a specific file is provided in the options, it will load that file.
 * Otherwise, it will attempt to load from a predefined list of accepted environment files.
 *
 * @param {string} [currentWD=process.cwd()] - The current working directory. Defaults to the current process working directory.
 * @param {Object} [options] - Optional configuration for environment setup.
 * @param {string} [options.file] - The specific `.env` file to load. If not provided, a default set of files will be used in order of precedence.
 * @param {string} [options.encoding="utf8"] - The file encoding to use when reading `.env` files.
 * @param {Object | ObjectValidator } [options.validators] - A list of validator object key-value to apply to the environment variables once loaded. Optional.
 * 
 * @returns {void} This function does not return a value.
 */
function tsetup(
    currentWD = process.cwd(),
    options = undefined
) {
    const sEnvFileName = "strict-env.d.ts";

    const filename = 'tsconfig.json';

    const fullPath = path.join(currentWD, filename);

    if(!fs.existsSync(fullPath)) {
        throw new Error(`The 'tsconfig.json' file does not exist at the specified path.`)
    }

    let config = fs.readFileSync(fullPath, {encoding: "utf8"});

    config = config.replaceAll(/\/\/.+/g, "");

    const tsconfig = JSON.parse(config);

    let rootDir = tsconfig["rootDir"];

    if(!rootDir) {
        rootDir = currentWD;
    } else {
        path.join(currentWD, rootDir);
    }

    const envMap = setup(options);

    const keys = Object.keys(envMap);

    const commonDtype = () => `interface ProcessEnv {
\t${keys.map(key => `${key}: '${envMap[key]}',`).join("\n\t")}
}

declare var process: {
    env: ProcessEnv;
};`

    let dtype;
    if (
        typeof Bun !== "undefined" || 
        typeof process !== "undefined" && process.release.name === "node"
    ) {
        dtype = commonDtype();
    } else {
        throw new Error("Unknown runtime");
    }

    const fullStrictEnvPath = path.join(rootDir, sEnvFileName);
    fs.writeFileSync(fullStrictEnvPath, dtype, {encoding: "utf8"});
}

module.exports = {
    tsetup
};