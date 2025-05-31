// --------- ① 設定 ---------
const API_KEY  = import.meta.env?.HOTPEPPER_API_KEY || "YOUR_KEY";
const SID      = import.meta.env?.VC_SID || "1234567";
const PID      = import.meta.env?.VC_PID || "890123456";

// --------- ② 店舗検索 ---------
async function search(keyword) {
  const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/` +
              `?key=${API_KEY}&keyword=${encodeURIComponent(keyword)}` +
              `&format=json&count=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API Error");
  return (await res.json()).results.shop;   // ← 店舗配列
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
