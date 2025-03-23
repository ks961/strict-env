// import { setup, Validator } from "./lib/esm/index.js";
const { setup, Validator } = require("./lib/cjs/index.js");

const validators = Validator.object({
    // name: Validator.string().regex(//),
})

// const validators = {
//     name: Validator.string().minLength(10),
// }

setup({
    validators
});

console.log(process.env.NAME);
