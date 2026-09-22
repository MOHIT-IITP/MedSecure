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

    if (!newUser) {
      return NextResponse.json(
        { success: false, message: "User creation failed" },
        { status: 500 }
      );
    }

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
  } catch (error: any) {
    console.error("Signup error:", error);
    const isDbError =
      !process.env.DATABASE_URL ||
      error?.code === "ECONNREFUSED" ||
      error?.message?.toLowerCase().includes("database") ||
      error?.message?.toLowerCase().includes("connect") ||
      error?.message?.toLowerCase().includes("relation");

    return NextResponse.json(
      {
        success: false,
        message: isDbError
          ? "Database connection failed. Please ensure DATABASE_URL is configured in your .env file and PostgreSQL is running."
          : error?.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
