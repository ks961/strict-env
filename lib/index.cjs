"use strict";
const fs = require("node:fs");
const { EnvParseError } = require("./error.cjs");
const { eValidator } = require("./evalidator.cjs");
const { Validator, ObjectValidator } = require("@d3vtool/validator");


const REF_REGEX = /\$\{(.+?)\}/g;
const EXTRACT_LINE_NO_REGEX = /'(.+?)'/;

/**
 * Loads the environment variables to process.env.
 * 
 * @param {string} filePath - The path to your env file.
 * @param {string} encoding - The encoding to use when reading the file (default is 'utf8').
 * @param {ObjectValidator | Object} validators - An object or object-validator of validator functions to check each key-value pair.
 */
function loadEnv(filePath, encoding, validators) {
    const fileData = fs.readFileSync(filePath, {encoding: encoding ?? "utf8"});
    const envMap = parseEnv(fileData);

    if(validators) {
        eValidator(
            validators,
            envMap
        );
    }
    
    for(const key in envMap) {
        if(envMap[key] === undefined) continue;
        process.env[key] = envMap[key];
    }

    return envMap;
}

function parseEnv(fileData) {
    const envMap = {};

    const laterRefStack = [];

    const lines = fileData.split("\n");

    let isLineOptional = false;
    for(let line = 0; line < lines.length; ++line) {
        if(
            lines[line].startsWith("#") || 
            lines[line].trim().length === 0
        ) continue;
        
        
        if(!lines[line].includes("=")) {
            throw new EnvParseError("Line expected to have key-value pair seperated by '='");
        }

        let [ envKey, envValue ] = lines[line].split("=");
        
        // check if there is comment at the end of value part.
        if(envValue.includes("#")) {
            const segments = envValue.split("#");
            
            envValue = segments[0];

            if(segments[1].includes("$optional")) {
                isLineOptional = true;
            }
        }

        envKey = envKey.trim();
        envValue = envValue?.trim();

        if (envValue?.includes("'")) {
            envValue = envValue?.replaceAll("'", "");
        } else if (envValue?.includes('"')) {
            envValue = envValue?.replaceAll('"', "");
        }

        if(envValue.includes("${")) {
            
            const matchedRefKeys = [...envValue.matchAll(REF_REGEX)];

            for(let idx = 0; idx < matchedRefKeys.length; ++idx) {
                const actualValueToReplace = matchedRefKeys[idx][0];
                const refKey = matchedRefKeys[idx][1];
                
                const referedValue = envMap[refKey];

                if(referedValue === undefined) {                    
                    laterRefStack.push({
                        envKey,
                        refKey,
                        actualValueToReplace,
                        errorMsg: `At Line '${line+1}' invalid reference key found "${refKey}".`
                    });
                    continue;
                }
                envValue = envValue.replaceAll(actualValueToReplace, referedValue);
            }
        }

        if(envKey.length === 0)
            throw new EnvParseError(`Environment variable key is missing at line: ${line+1}`);
        
        if(envValue?.length === 0 && !isLineOptional)
            throw new EnvParseError(`Environment variable '${envKey}' value is missing at line: ${line+1}`);

        envMap[envKey] = isLineOptional && envValue?.length === 0 ? undefined : envValue;
        
        isLineOptional = false;
    }

    while(laterRefStack.length !== 0) {
        const refContext = laterRefStack.pop();

        const envValue = envMap[refContext.refKey];

        if(!envValue) {
            throw new EnvParseError(refContext.errorMsg);
        }

        if(envValue === refContext.actualValueToReplace) {
            const lineNo = refContext.errorMsg.match(EXTRACT_LINE_NO_REGEX)[1];
            throw new EnvParseError(`Circular reference is not allowed on line '${lineNo}'.`);
        }

        envMap[refContext.envKey] = envMap[refContext.envKey]?.replaceAll(refContext.actualValueToReplace, envValue);
    }

    return envMap;
}

/**
 * Sets up environment configuration by loading environment files.
 * If a specific file is provided in the options, it will load that file.
 * Otherwise, it will attempt to load from a set of predefined accepted environment files.
 *
 * @param {Object} options - Configuration options for setting up the environment.
 * @param {string} [options.file] - The specific environment file to load. If not provided, the function will attempt to load from a list of accepted files.
 * @param {string} [options.encoding="utf8"] - The encoding used to read the file. Default is "utf8".
 * @param {Object | ObjectValidator } [options.validators] - A list of validator object key-value to apply to the environment variables once loaded. Optional.
 * 
 * @returns {void} This function does not return anything.
 */
function setup(options) {
    if(options && options?.file) {
        return loadEnv(options?.file, options?.encoding, options?.validators);
    } else {
        const defaultDotEnv = ".env";
        if(!fs.existsSync(defaultDotEnv)) return;
        return loadEnv(defaultDotEnv, "utf8", options?.validators);
    }
}


module.exports = {
    setup,
    Validator
};