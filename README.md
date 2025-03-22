# strict-env

`strict-env` is a simple utility that automatically loads environment variables from pre-defined `.env` files when imported or required in your project. It ensures strict validation of your environment variables before your system starts, so you can always be sure that the required variables are present and properly configured.

## Why Choose `strict-env`?

Unlike other solutions, `strict-env` performs strict validation on your `.env` files to ensure that your environment variables are correctly set up. If there are any issues with the configuration (such as missing keys or values), `strict-env` will throw clear, explicit errors. This guarantees that your environment is correctly configured before your application starts, helping you avoid runtime issues related to missing or misconfigured environment variables.

With `strict-env`, you can always be confident that your environment variables are loaded correctly, and your application will be running with the proper configuration.

## Installation

You can install `strict-env` via npm or yarn:

```bash
npm install @d3vtool/strict-env
# or
yarn add @d3vtool/strict-env
```

## Usage

### Importing the Package

Simply import or require `@d3vtool/strict-env` in your project, and it will automatically load environment variables from the following `.env` files:

- `.env.local`
- `.env.production`
- `.env.staging`
- `.env.test`
- `.env.development`
- `.env`

#### ESM (ES6 Modules)

```javascript
import '@d3vtool/strict-env';
```

#### CommonJS (CJS)

```javascript
require('@d3vtool/strict-env');
```

Once the package is imported, it will automatically load the environment variables from the predefined `.env` files. No additional code is necessary!

### Example

```javascript
// Importing for ESM projects
import '@d3vtool/strict-env';

// or for CommonJS projects
// require('@d3vtool/strict-env');

console.log(process.env.MY_ENV_VAR);  // Logs the value of the environment variable
```

## How It Works

The `@d3vtool/strict-env` package automatically loads the environment variables from the following `.env` files (in this order):

1. `.env.local`
2. `.env.production`
3. `.env.staging`
4. `.env.test`
5. `.env.development`
6. `.env`

It loads the first `.env` file found in this list and ensures that all environment variables are properly set before your application runs.

## Customizing Environment File Names

If you want to add your own custom environment file names, you can easily do so by editing the `acceptedEnvFiles.cjs` file in the library folder.

### Steps to Customize:

1. Navigate to the library folder in the `@d3vtool/strict-env` package.
2. Open the `acceptedEnvFiles.cjs` file.
3. Add your custom `.env` file names to the `acceptedEnvFiles` array.

Example:

```javascript
const acceptedEnvFiles = [
    ".env.local",
    ".env.production",
    ".env.staging",
    ".env.test",
    ".env.development",
    ".env", 
    // Add your custom env file here
    ".env.custom"  // Example: Add a custom file
];
```

By editing this file, you can specify any custom environment files that you want `@d3vtool/strict-env` to load in addition to the default ones.