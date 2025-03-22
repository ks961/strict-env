"use strict";
import fs from "fs";
import { ParseEnvError } from "./error.js";
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

    for(let line = 0; line < lines.length; ++line) {
        if(
            lines[line].startsWith("#") || 
            lines[line].trim().length === 0
        ) continue;
        
        
        if(!lines[line].includes("=")) {
            throw new ParseEnvError("Line expected to have key-value pair seperated by '='");
        }

        let [ envKey, envValue ] = lines[line].split("=");
        
        // check if there is comment at the end of value part.
        if(envValue.includes("#")) {
            envValue = envValue.split("#")[0]; // discard comment part
        }

        envKey = envKey.trim();
        envValue = envValue.trim();

        if (envValue.includes("'")) {
            envValue = envValue.replaceAll("'", "");
        } else if (envValue.includes('"')) {
            envValue = envValue.replaceAll('"', "");
        }


        if(envKey.length === 0)
            throw new ParseEnvError(`Env variable key is missing at line: ${line+1}`);
        
        if(envValue.length === 0)
            throw new ParseEnvError(`Env variable '${envKey}' value is missing at line: ${line+1}`);
        
        

        envMap[envKey] = envValue;
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