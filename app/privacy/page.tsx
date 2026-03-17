export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-2xl mx-auto prose prose-sm">
        <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>
        <p>ダルマ落とし PHYSICS（以下「本サービス」）は、ユーザーの個人情報を以下の方針に基づいて取り扱います。</p>
        <h2 className="text-lg font-bold mt-6 mb-3">収集する情報</h2>
        <p>本サービスは、決済時にクレジットカード情報の処理をPAY.JP（PAY株式会社）に委託しており、カード情報は当サービスのサーバーに保存されません。お問い合わせ時のみ、ご連絡先情報を収集します。</p>
        <h2 className="text-lg font-bold mt-6 mb-3">Cookieの使用</h2>
        <p>本サービスは、プレミアム認証状態の保持のためにCookieを使用します。</p>
        <h2 className="text-lg font-bold mt-6 mb-3">アクセス解析</h2>
        <p>本サービスはVercel Analyticsを使用してアクセス状況を分析します。個人を特定する情報は収集しません。</p>
        <h2 className="text-lg font-bold mt-6 mb-3">第三者提供</h2>
        <p>法令に基づく場合を除き、個人情報を第三者に提供することはありません。</p>
        <h2 className="text-lg font-bold mt-6 mb-3">お問い合わせ</h2>
        <p>X(Twitter) @levona_design へのDM</p>
        <a href="/" className="text-blue-600 text-sm mt-6 inline-block">← トップへ戻る</a>
      </div>
    </div>
  );
}
