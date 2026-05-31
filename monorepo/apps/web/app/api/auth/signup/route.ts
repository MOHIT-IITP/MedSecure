import { signupSchema } from "../../../../../../packages/validation";
import { NextResponse } from "next/server";
import { db } from "../../../../../../packages/db";
import { users } from "../../../../../../packages/db";
import { hashPassword, generateJWT } from "../../../../../../packages/auth";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request
){
  try {
    const body = await req.json();

    const parsed = signupSchema.safeParse(body);
    if(!parsed.success){
      return NextResponse.json(
        {
          success: false,
          error:parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }
    const {
      name , email, password
    } = parsed.data;

    const existingUser = 
      await db.query.users.findFirst({
      where: eq(
        users.email,email
      ),
    });

    if(existingUser){
      return NextResponse.json(
        {
          success: false,
          message: 
            "User already exists",
        },{
          status: 409,
        }
      );
    }

    const hashedPassword = 
      await hashPassword(
        password
    );

    const [newUser] = 
      await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();


    const token = generateJWT({
      id: newUser.id,
      email: newUser.email,
    });

    const response = 
      NextResponse.json({
      success: true,
      message: "Signup successful",

      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

    response.cookies.set(
      "token",
      token,
      {
        httpOnly: true,
        secure: process.env
        .NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60*60*24*7,
        path:"/",
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },{
        status: 500,
      }
    );
  }
}
