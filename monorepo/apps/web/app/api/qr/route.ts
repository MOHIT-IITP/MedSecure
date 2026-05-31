import {

  NextResponse,

} from "next/server";

import {

  cookies,

} from "next/headers";

import crypto
from "crypto";

import {

  verifyJWT,

} from "../../../../../packages/auth";

import {

  db,

  qrAccess,

} from "../../../../../packages/db";

import { eq }
from "drizzle-orm";

function dashboardBaseUrl() {
  return (
    process.env.DASHBOARD_URL?.replace(/\/$/, "") ??
    "http://localhost:3001"
  );
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

    const existing =
      await db.query.qrAccess
        .findFirst({

          where:eq(
            qrAccess.userId,
            payload.id
          ),
        });

    if (existing) {

      return NextResponse.json({

        success:true,

        qrUrl: `${dashboardBaseUrl()}/view/${existing.token}`,

      });
    }

    const secureToken =
      crypto.randomUUID();

    await db
      .insert(qrAccess)
      .values({

        userId:
          payload.id,

        token:
          secureToken,
      });

    return NextResponse.json({

      success:true,

      qrUrl: `${dashboardBaseUrl()}/view/${secureToken}`,

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