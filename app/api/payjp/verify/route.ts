// TODO: PAY.JP本番承認後に実装
// 参考実装: D:\99_Webアプリ\介護カスハラAI\app\api\payjp\verify\route.ts

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const premium = req.cookies.get("premium")?.value;
  return NextResponse.json({ premium: premium === "1" });
}
