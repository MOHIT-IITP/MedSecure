import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { verifyJWT } from "../../../../../../packages/auth";
import { db, reports } from "../../../../../../packages/db";
import { supabase } from "../../../../lib/supabase";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { id } = await context.params;

    const [report] = await db
      .select()
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.userId, payload.id)))
      .limit(1);

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase.storage
      .from("medical-reports")
      .createSignedUrl(report.fileUrl, 60 * 10);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { success: false, message: error?.message ?? "Could not create download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: data.signedUrl,
      report: {
        id: report.id,
        title: report.title,
        fileType: report.fileType,
        uploadedAt: report.uploadedAt,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { id } = await context.params;

    const [report] = await db
      .select()
      .from(reports)
      .where(and(eq(reports.id, id), eq(reports.userId, payload.id)))
      .limit(1);

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    await supabase.storage.from("medical-reports").remove([report.fileUrl]);

    await db.delete(reports).where(eq(reports.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
