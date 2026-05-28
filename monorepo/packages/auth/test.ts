import {
  generateJWT,
  verifyJWT,
} from "./index";

const token =
  generateJWT({

    id:"1",

    email:"test@gmail.com",
});

console.log(token);

console.log(
  verifyJWT(token)
);
