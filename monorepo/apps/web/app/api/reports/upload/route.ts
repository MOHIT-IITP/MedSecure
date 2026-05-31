import {

  NextResponse,

} from "next/server";

import {

  cookies,

} from "next/headers";

import { verifyJWT } from "../../../../../../packages/auth";

import { db, reports } from "../../../../../../packages/db";

import { supabase }
from "@/lib/supabase";

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

    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    const title =
      formData.get(
        "title"
      ) as string;

    if (!file) {

      return NextResponse.json(
        {
          success:false,
          message:
            "No file",
        },
        {
          status:400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const filePath =

      `${payload.id}/${
        Date.now()
      }-${file.name}`;

    const {
      error,
    } = await supabase
      .storage
      .from(
        "medical-reports"
      )
      .upload(
        filePath,
        buffer,
        {

          contentType:
            file.type,
        }
      );

    if (error) {

      return NextResponse.json(
        {
          success:false,
          error:
            error.message,
        },
        {
          status:500,
        }
      );
    }

    const [savedReport] =
      await db
        .insert(reports)
        .values({

          userId:
            payload.id,

          title,

          fileUrl:
            filePath,

          fileType:
            file.type,
        })
        .returning();

    return NextResponse.json({

      success:true,

      report:savedReport,
    });

  } catch (error) {

    console.error(error);

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