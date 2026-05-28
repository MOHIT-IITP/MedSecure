import jwt from "jsonwebtoken"

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
){
  try {
    return jwt.verify(
      token,
      JWT_SECRET
    );
  } catch (error) {
    return null;
  }
}
