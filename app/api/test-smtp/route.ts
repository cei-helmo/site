import { NextResponse } from "next/server";
import { testSMTPConnection } from "../../../src/utils/email";

export async function GET() {
  try {
    const isWorking = await testSMTPConnection();
    
    if (isWorking) {
      return NextResponse.json(
        { 
          status: "success", 
          message: "SMTP configuration is working correctly",
          smtp: "connected"
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: "error", 
          message: "SMTP configuration failed",
          smtp: "failed"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SMTP test error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "SMTP test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
