// --------- ① 設定 ---------
const API_KEY  = import.meta.env?.HOTPEPPER_API_KEY || "YOUR_KEY";
const SID      = import.meta.env?.VC_SID || "1234567";
const PID      = import.meta.env?.VC_PID || "890123456";

// --------- ② 店舗検索 ---------
const API_GATEWAY = "https://gourmet-api.yourname.workers.dev"; // ← proxy URL

async function search(keyword) {
  const res = await fetch(`${API_GATEWAY}?q=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("proxy error");
  return (await res.json()).results.shop;
}


// --------- ③ VC Deeplink 生成 ---------
function toVcLink(shopUrl) {
  const base = "https://ck.jp.ap.valuecommerce.com/servlet/referral";
  const target = encodeURIComponent(shopUrl);
  return `${base}?sid=${SID}&pid=${PID}&vc_url=${target}`;
}

// --------- ④ 画面描画 ---------
function render(list) {
  const box = document.getElementById("result");
  box.innerHTML = "";                         // クリア
  list.forEach(s => {
    const card = document.createElement("article");
    card.innerHTML = `
      <h2>${s.name}</h2>
      <p>${s.genre.name} / ${s.budget.name}</p>
      <a href="${toVcLink(s.urls.pc)}" target="_blank" rel="noopener">
        予約はこちら
      </a>`;
    box.appendChild(card);
  });
}

// --------- ⑤ 検索フォームを監視 ---------
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const kw = document.getElementById("keyword").value.trim();
  if (!kw) return;
  search(kw).then(render).catch(alert);
});

// wrangler.toml で名前とアカウントを設定
export default {
async fetch(request) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    const apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/` +
    `?key=${HOTPEPPER_KEY}&keyword=${encodeURIComponent(q)}&format=json&count=20`;

    const res = await fetch(apiUrl);

    return new Response(res.body, {
    status: res.status,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",             // ← ここが最重要！
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*"
    }
    });
}
}
