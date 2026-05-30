import { cookies }
from "next/headers";

import {
  NextResponse,
} from "next/server";

import {
  verifyJWT,
} from "../../../../../packages/auth";

import {
  db,
  users,
} from "../../../../../packages/db";

import {
  profileSchema,
} from "../../../../../packages/validation";

import { eq }
from "drizzle-orm";


export async function GET() {

  try {

    const cookieStore =
      await cookies();

    const token =
      cookieStore
        .get("token")
        ?.value;

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

    const user =
      await db.query.users
        .findFirst({

          where:eq(
            users.id,
            payload.id
          ),
        });

    return NextResponse.json({

      success:true,

      user,
    });

  } catch {

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

export async function PATCH(
  req: Request
) {

  try {

    const cookieStore =
      await cookies();

    const token =
      cookieStore
        .get("token")
        ?.value;

    if (!token) {

      return NextResponse.json(
        {
          success:false,
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
        },
        {
          status:401,
        }
      );
    }

    const body =
      await req.json();

    const parsed =
      profileSchema
        .safeParse(body);

    if (!parsed.success) {

      return NextResponse.json(
        {
          success:false,

          errors:
            parsed.error
              .flatten(),
        },
        {
          status:400,
        }
      );
    }

    const [updatedUser] =
      await db
        .update(users)
        .set({

          ...parsed.data,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            users.id,
            payload.id
          )
        )
        .returning();

    return NextResponse.json({

      success:true,

      user:updatedUser,
    });

  } catch {

    return NextResponse.json(
      {
        success:false,
      },
      {
        status:500,
      }
    );
  }
}