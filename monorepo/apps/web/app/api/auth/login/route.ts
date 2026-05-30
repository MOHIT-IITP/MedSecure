import { NextResponse } from "next/server";

import { db, users } from "../../../../../../packages/db";

import {
  loginSchema,
} from "../../../../../../packages/validation";

import {
  comparePassword,
  generateJWT,
} from "../../../../../../packages/auth";

import { eq } from "drizzle-orm";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const parsed =
      loginSchema.safeParse(
        body
      );

    if (!parsed.success) {

      return NextResponse.json(
        {
          success:false,
          errors:
            parsed.error.flatten(),
        },
        {
          status:400,
        }
      );
    }

    const {
      email,
      password,
    } = parsed.data;

    const user =
      await db.query.users
        .findFirst({

          where: eq(
            users.email,
            email
          ),
        });

    if (!user) {

      return NextResponse.json(
        {
          success:false,
          message:
            "Invalid credentials",
        },
        {
          status:401,
        }
      );
    }

    const isValid =
      await comparePassword(
        password,
        user.password
      );

    if (!isValid) {

      return NextResponse.json(
        {
          success:false,
          message:
            "Invalid credentials",
        },
        {
          status:401,
        }
      );
    }

    const token =
      generateJWT({

        id:user.id,

        email:user.email,
      });

    const response =
      NextResponse.json({

        success:true,

        message:
          "Login successful",

        user:{

          id:user.id,

          name:user.name,

          email:user.email,
        },
      });

    response.cookies.set(
      "token",
      token,
      {

        httpOnly:true,

        secure:
          process.env
            .NODE_ENV ===
          "production",

        sameSite:"strict",

        maxAge:
          60 * 60 * 24 * 7,

        path:"/",
      }
    );

    return response;

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success:false,

        message:
          "Internal Server Error",
      },
      {
        status:500,
      }
    );
  }
}