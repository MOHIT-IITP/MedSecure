import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    "../../.env"
  ),
});

const JWT_SECRET =
  process.env.JWT_SECRET!;

export function generateJWT(
  payload: {
    id: string;
    email: string;
  }
) {

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyJWT(
  token: string
) {

  try {

    return jwt.verify(
      token,
      JWT_SECRET
    );

  } catch {

    return null;
  }
}
