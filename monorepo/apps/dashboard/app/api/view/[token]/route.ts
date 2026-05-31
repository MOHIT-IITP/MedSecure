import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import {
  db,
  healthRecords,
  qrAccess,
  toPublicHealthProfile,
  users,
} from "../../../../../../packages/db";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    if (!token?.trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 400 }
      );
    }

    const access = await db.query.qrAccess.findFirst({
      where: eq(qrAccess.token, token),
    });

    if (!access) {
      return NextResponse.json(
        { success: false, message: "QR access not found" },
        { status: 404 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, access.userId),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    const records = await db
      .select({
        bloodPressure: healthRecords.bloodPressure,
        sugarLevel: healthRecords.sugarLevel,
        weight: healthRecords.weight,
        pulse: healthRecords.pulse,
        notes: healthRecords.notes,
        createdAt: healthRecords.createdAt,
      })
      .from(healthRecords)
      .where(eq(healthRecords.userId, user.id))
      .orderBy(desc(healthRecords.createdAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      profile: toPublicHealthProfile(user),
      healthRecords: records,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
