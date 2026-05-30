import { cookies }
from "next/headers";

import { NextResponse }
from "next/server";

import {
  verifyJWT,
} from "../../../../../../packages/auth";

import {
  db,
  users,
} from "../../../../../../packages/db";

import { eq }
from "drizzle-orm";

export async function GET() {

  try {

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        "token"
      )?.value;

    if (!token) {

      return NextResponse.json(
        {

          success:false,

          message:
            "Unauthorized",
        },
        {
          status:401,
        }
      );
    }

    const payload =
      verifyJWT(token);

    if (!payload) {

      return NextResponse.json(
        {

          success:false,

          message:
            "Invalid token",
        },
        {
          status:401,
        }
      );
    }

    const decoded =
      payload as {

        id:string;
      };

    const user =
      await db.query.users
        .findFirst({

          where:eq(
            users.id,
            decoded.id
          ),
        });

    if (!user) {

      return NextResponse.json(
        {

          success:false,

          message:
            "User not found",
        },
        {
          status:404,
        }
      );
    }

    return NextResponse.json({

      success:true,

      user:{

        id:user.id,

        name:user.name,

        email:user.email,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {

        success:false,

        message:
          "Server error",
      },
      {
        status:500,
      }
    );
  }
}