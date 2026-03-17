// TODO: PAY.JP本番承認後に実装
// 参考実装: D:\99_Webアプリ\介護カスハラAI\app\api\payjp\checkout\route.ts

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function auth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

async function payjpPost(path: string, body: Record<string, string>) {
  const res = await fetch(`${PAYJP_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

const PLANS: Record<string, string> = {
  standard: process.env.PAYJP_PLAN_STD!,
};

export async function POST(req: NextRequest) {
  if (!process.env.PAYJP_SECRET_KEY || !process.env.PAYJP_PLAN_STD) {
    return NextResponse.json({ error: "PAY.JP設定が未完了です。本番承認後に有効になります。" }, { status: 503 });
  }

  const { token, plan } = await req.json();
  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  const planId = PLANS[plan ?? "standard"];
  if (!planId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  try {
    const customer = await payjpPost("/customers", { card: token });
    if (customer.error) {
      return NextResponse.json({ error: customer.error.message }, { status: 400 });
    }

    const sub = await payjpPost("/subscriptions", {
      customer: customer.id,
      plan: planId,
    });
    if (sub.error) {
      return NextResponse.json({ error: sub.error.message }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("premium", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 366,
      path: "/",
    });
    if (sub?.id) {
      res.cookies.set("payjp_sub_id", sub.id, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 366,
        path: "/",
      });
    }
    return res;
  } catch {
    return NextResponse.json({ error: "決済処理に失敗しました" }, { status: 500 });
  }
}
