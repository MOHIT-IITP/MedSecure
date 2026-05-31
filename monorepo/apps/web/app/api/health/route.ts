import {

  NextResponse,

} from "next/server";

import {

  cookies,

} from "next/headers";

import {

  verifyJWT,

} from "../../../../../packages/auth";

import {

  db,

  healthRecords,

} from "../../../../../packages/db";

import {

  healthRecordSchema,

} from "../../../../../packages/validation";

import { eq, desc }
from "drizzle-orm";
export async function POST(
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
      healthRecordSchema
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

    const [record] =
      await db
        .insert(
          healthRecords
        )
        .values({

          userId:
            payload.id,

          ...parsed.data,
        })
        .returning();

    return NextResponse.json({

      success:true,

      record,
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

    const records =
      await db
        .select()
        .from(
          healthRecords
        )
        .where(
          eq(
            healthRecords.userId,
            payload.id
          )
        )
        .orderBy(
          desc(
            healthRecords
              .createdAt
          )
        );

    return NextResponse.json({

      success:true,

      records,
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