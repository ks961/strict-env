"use strict";
import fs from "fs";
import { EnvParseError } from "../error.cjs";
import { acceptedEnvFiles } from '../acceptedEnvFiles.cjs';

/**
 * Loads the environment variable to process.env.
 * 
 * @param {string} filePath - Your env file path.
 */
function loadEnv(filePath) {
    const fileData = fs.readFileSync(filePath, {encoding: "utf8"});
    const envMap = parseEnv(fileData);
    
    for(const key in envMap) {        
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

        envMap[envKey] = envValue;
        isLineOptional = false;
    }

    return envMap;
}

function setup() {
    let count = 0;
    for(const file of acceptedEnvFiles) {
        if (!fs.existsSync(file)) {
            count++;
            continue;
        }

        loadEnv(file);
    }

    if(count === acceptedEnvFiles.length) {
        throw new Error("No Env file found, please add one or remove this import.");
    }
}

setup();