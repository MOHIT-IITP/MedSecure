import {

  NextResponse,

} from "next/server";

import {

  cookies,

} from "next/headers";

import { verifyJWT } from "../../../../../packages/auth";

import { db, reports } from "../../../../../packages/db";

import { eq }
from "drizzle-orm";

export async function GET() {

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

  const userReports =
    await db
      .select()
      .from(reports)
      .where(
        eq(
          reports.userId,
          payload.id
        )
      );

  return NextResponse.json({

    success:true,

    reports:userReports,
  });
}