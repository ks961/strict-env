# strict-env

`strict-env` is a simple utility that automatically loads environment variables from pre-defined `.env` files when imported or required in your project. It ensures strict syntax checks and validation of your environment variables before your system starts, preventing potential issues from missing or misconfigured variables.

## Why Choose `strict-env`?

Unlike other solutions, `strict-env` provides **strict syntax checks and validation** of your `.env` files, ensuring that your environment variables are correctly set up. If any environment variables are missing or have invalid values, `strict-env` throws **clear, explicit errors**. This helps you catch potential misconfigurations before your application runs, avoiding runtime issues.

With `strict-env`, you can be confident that your environment variables are loaded correctly, and your application is running with the proper configuration from the start.

---

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)

  * [Auto Loading of Environment Variables](#auto-loading-of-environment-variables)
  * [Custom Setup (Optional)](#custom-setup-optional)
  * [Custom Validators](#custom-validators)
  * [How Validation Works](#how-validation-works)
  * [Example: Defining Multiple Validators](#example-defining-multiple-validators)
  * [Example: Referencing Environment Variables](#example-referencing-environment-variables)
* [How It Works](#how-it-works)

  * [Customizing Environment File Names](#customizing-environment-file-names)
  * [TypeScript Environment Variable Auto-Completion](#typescript-environment-variable-auto-completion)

---

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

### Auto Loading of Environment Variables

To automatically load environment variables from the predefined `.env` files, simply import the setup file like so:

#### ESM (ES6 Modules)

```javascript
import "@d3vtool/strict-env/setup";
```

#### CommonJS (CJS)

```javascript
require("@d3vtool/strict-env/setup");
```

Once `@d3vtool/strict-env/setup` is imported, it will automatically load the environment variables from the following `.env` files in the order specified:

- `.env.local`
- `.env.production`
- `.env.staging`
- `.env.test`
- `.env.development`
- `.env`

You don’t need to do anything else to load your environment variables; it will be handled automatically.

### Custom Setup (Optional)

If you want more control over which `.env` file to load or other configurations, you can import and use the `setup` function directly:

#### ESM (ES6 Modules)

```javascript
import { setup } from "@d3vtool/strict-env/setup";
```

#### CommonJS (CJS)

```javascript
const { setup } = require("@d3vtool/strict-env/setup");
```

The `setup` function accepts an `options` object, which allows for customization. Here's what you can specify:

- **`file`**: The specific `.env` file to load. If not provided, `strict-env` will try the default list of `.env` files.
- **`encoding`**: The encoding to use when reading the file (defaults to `utf8`).
- **`validators`**: Custom validation rules for your environment variables (see the [Validator](#validators) section below).

Example usage:

```javascript

const setupOptions = {
  file: ".env.custom",  // Load a custom env file [ optional ]
  encoding: "utf8",     // Set the encoding [ optional ]
  validators: {         // Add custom validators (see below) [ optional ]
    MY_VAR: Validator.string().minLength(10)
  }
}
setup(setupOptions); // although passing 'setupOptions' is also optional.
```

The `setup` function will load the `.env` file(s) and validate the environment variables as defined in the `validators` option.

### Custom Validators

The `validators` object allows you to specify rules for environment variables. You can define rules for various data types such as string, number, boolean, and object. You can also create custom validation logic or use regular expressions.

#### Example Usage:

```javascript
const { setup, Validator } = require("@d3vtool/strict-env");

// Define validators
const validators = Validator.object({
  MY_ENV_VAR: Validator.string().minLength(10),  // A string with a minimum length of 10
  API_KEY: Validator.string().regex(/^[A-Za-z0-9]{32}$/),  // Regex for a 32-character API key
  IS_PROD: Validator.boolean()  // A boolean value (true/false)
});

setup({
  validators
});
```

You can also use custom validation functions:

```javascript
const validators = {
  MY_ENV_VAR: Validator.string().custom(value => {
    return (value !== "expected_value");
  })
};

setup({
  validators
});
```

### How Validation Works

Each validator type supports a variety of methods, such as `minLength()`, `maxLength()`, `regex()`, `custom()`, and others for different data types:

- **`Validator.string()`**: Use for strings, can chain methods like `.minLength()` and `.regex()`.
- **`Validator.number()`**: Use for numbers, can chain methods like `.minLength()`, `.maxLength()`, and `.integer()`.
- **`Validator.boolean()`**: Use for boolean values (`true` or `false`).
- **`Validator.object()`**: Use for nested objects.

### Example: Defining Multiple Validators

```javascript
const { setup, Validator } = require("@d3vtool/strict-env");

const validators = Validator.object({
  USERNAME: Validator.string().minLength(5),  // Username must be at least 5 characters long
  API_KEY: Validator.string().regex(/^[A-Za-z0-9]{32}$/),  // A 32-character API key
  PORT: Validator.number().minLength(1024).maxLength(65535),  // Port must be between 1024 and 65535
  ENABLE_FEATURE: Validator.boolean().strict(),  // Must be a boolean value (true or false)
  EMAIL: Validator.string().custom(value => {
    return (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value));
  })  // Custom email validation
});

setup({
  validators // optional to pass.
});
```

### Example: Referencing Environment Variables

```.env
# 1. Standard Variable Reference
POSTGRES_USER=user
POSTGRES_PASS=pass
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASS}@localhost/db_your_db

# 2. Circular References (This will result in an error)
A=${B}
B=${A}

# 3. Multiple References within a Single Variable
PREFIX=pre_
SUFFIX=_post
COMBO=${PREFIX}middle${SUFFIX}

# 4. Single Variable Reference
FOO=bar
VAR_WITH_FOO=prefix_${FOO}_suffix

# 5. Nested / Late References
OUTER_VAR=outer_${INNER_VAR}
INNER_VAR=inner

# 6. Variables without References
SIMPLE_VAR=value

# 7. Empty Variables (This will result in an error)
EMPTY_VAR=

# 8. Empty Variables ( But This can be set to optional for later use, using '# $optional ' )
EMPTY_VAR= # $optional [ using comment '#' followed by keyword '$optional' ]

# 9. Handling Leading and Trailing Whitespace in Variables (Whitespace will be trimmed from both ends)
WITH_WHITESPACE =   value   with spaces  _

# 10. Special Characters in Variables (Note: The '#' character is reserved for comments)
SPECIAL_VAR=!@$%^&*()
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

### Customizing Environment File Names

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

### TypeScript Environment Variable Auto-Completion

Enable auto-completion for environment variables in your TypeScript projects.

**Automatic Environment Variable Loading:**

```typescript
import "@d3vtool/strict-env/tsetup";
```

**Custom `tsconfig.json` Path Configuration:**

```typescript
import { tsetup } from "@d3vtool/strict-env/tindex";

// Uses the current working directory by default for 'tsconfig.json'
tsetup();

// Or specify a custom path to your 'tsconfig.json' file
tsetup("src"); // Indicates that 'tsconfig.json' is located in the 'src' directory.
```

Note: If the file 'strict-env.d.ts' already exists, the process will exit early and skip parsing your environment variables.

Therefore, if you have made changes to your .env file, you need to manually delete 'strict-env.d.ts' to force a re-parse of the environment variables.