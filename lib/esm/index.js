"use strict";
import fs from "fs";
import ev from "../evalidator.cjs";
import { EnvParseError } from "../error.cjs";
import { Validator } from "@d3vtool/validator";
import { acceptedEnvFiles } from '../acceptedEnvFiles.cjs';

const { eValidator } = ev;

/**
 * Loads the environment variable to process.env.
 * 
 * @param {string} filePath - Your env file path.
 */
function loadEnv(filePath, encoding, validators) {
    const fileData = fs.readFileSync(filePath, {encoding});
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
}

function parseEnv(fileData) {
    const envMap = {};

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

        if(envKey.length === 0)
            throw new EnvParseError(`Env variable key is missing at line: ${line+1}`);
        
        if(envValue?.length === 0 && !isLineOptional)
            throw new EnvParseError(`Env variable '${envKey}' value is missing at line: ${line+1}`);

        envMap[envKey] = isLineOptional && envValue?.length === 0 ? undefined : envValue;
        
        isLineOptional = false;
    }

    return envMap;
}


function setup(options) {
    let count = 0;

    if(options && options?.file) {
        loadEnv(options?.file, options?.encoding, options?.validators);
    } else {
        for(const file of acceptedEnvFiles) {
            if (!fs.existsSync(file)) {
                count++;
                continue;
            }
    
            loadEnv(file, "utf8", options?.validators);
        }
    }

    if(count === acceptedEnvFiles.length) {
        throw new Error("No Env file found, please add one or remove this import.");
    }
}

export {
    setup,
    Validator
};