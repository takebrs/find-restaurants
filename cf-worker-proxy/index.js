export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const q = url.searchParams.get("q") || "";
  
      const apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/` +
        `?key=${env.HOTPEPPER_KEY}&keyword=${encodeURIComponent(q)}&format=json&count=20`;
  
      const res = await fetch(apiUrl);
  
      return new Response(res.body, {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }
  }
  