# strict-env

`strict-env` is a simple utility that automatically loads environment variables from pre-defined `.env` files when imported or required in your project. It ensures strict validation of your environment variables before your system starts, preventing potential issues from missing or misconfigured variables.

## Why Choose `strict-env`?

Unlike other solutions, `strict-env` provides **strict validation** of your `.env` files, ensuring that your environment variables are correctly set up. If any environment variables are missing or have invalid values, `strict-env` throws **clear, explicit errors**. This helps you catch potential misconfigurations before your application runs, avoiding runtime issues.

With `strict-env`, you can be confident that your environment variables are loaded correctly, and your application is running with the proper configuration from the start.

## Installation

You can install `strict-env` via npm or yarn:

```bash
npm install @d3vtool/strict-env
```
### or
```bash
yarn add @d3vtool/strict-env
```

## Usage

### Importing the Package

To use `@d3vtool/strict-env`, simply import or require it in your project. It will automatically load environment variables from the following `.env` files:

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

Once `strict-env` is imported, it will automatically load the environment variables from the predefined `.env` files. No additional code is necessary!

### Example

Here’s how you can set environment variables:

```javascript
// Importing for ESM projects
import '@d3vtool/strict-env';

// or for CommonJS projects
// require('@d3vtool/strict-env');

console.log(process.env.MY_ENV_VAR);  // Logs the value of the environment variable
```

#### Setting Optional Environment Variables

You can also set environment variables as **optional**. To do this, simply add `# $optional` as a comment after the variable name in your `.env` file. If no value is provided for an optional variable, it will be set to `undefined`.

Example `.env` file:

```env
MY_REQUIRED_VAR=some_value  # Required variable, must be set
MY_OPTIONAL_VAR=  # $optional
MY_OPTIONAL_VAR_WITH_VALUE=some_value2  # $optional
```

In this case:
- `MY_REQUIRED_VAR` will throw an error if not provided or misconfigured.
- `MY_OPTIONAL_VAR` will be `undefined` if no value is set.
- `MY_OPTIONAL_VAR_WITH_VALUE` will be `some_value2`, even if its set to 'optional' [ optional field can have a value ].

```javascript
// Example Usage in Code:
console.log(process.env.MY_REQUIRED_VAR);  // Logs 'some_value'
console.log(process.env.MY_OPTIONAL_VAR);  // Logs 'undefined' if no value is provided
console.log(process.env.MY_OPTIONAL_VAR_WITH_VALUE);  // Logs 'some_value2' even if its set to 'optional'
```

## How It Works

The `strict-env` package loads environment variables from the following `.env` files (in this order):

1. `.env.local`
2. `.env.production`
3. `.env.staging`
4. `.env.test`
5. `.env.development`
6. `.env`

It loads the first `.env` file found in this list and ensures that all environment variables are correctly set before your application starts. If a variable is marked as optional (using `# $optional`), it will be set to `undefined` if no value is provided.

## Customizing Environment File Names

If you want to use custom environment file names, you can easily modify the configuration. Instead of editing the core package directly, you can override the default configuration in your project.

### Steps to Customize:

1. Copy the `acceptedEnvFiles.cjs` file from the `strict-env` package into your project's directory.
2. Modify the `acceptedEnvFiles` array to include your custom environment files.

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

This approach allows you to extend the configuration without modifying the core package, keeping it maintainable and compatible with future updates.