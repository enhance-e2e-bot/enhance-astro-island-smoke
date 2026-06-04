const backendPort = 8149;
const frontendOrigin = "http://localhost:4231";
const sentinel = "backend-secret-astro-island-8149";
let accountCount = 0;
let detailCount = 0;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      ...corsHeaders()
    }
  });
}

const server = Bun.serve({
  port: backendPort,
  fetch(request, server) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });

    if (url.pathname === "/socket") {
      if (server.upgrade(request)) return undefined;
      return new Response("Expected WebSocket", { status: 426 });
    }

    if (url.pathname === "/events") {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${JSON.stringify({ label: "real backend astro event stream", sentinel })}\n\n`);
          setTimeout(() => controller.close(), 100);
        }
      });
      return new Response(stream, {
        headers: {
          "content-type": "text/event-stream",
          "cache-control": "no-cache",
          ...corsHeaders()
        }
      });
    }

    if (url.pathname === "/api/account") {
      accountCount += 1;
      return json({
        label: `real backend astro account #${accountCount} · Québec 東京 Málaga`,
        route: url.searchParams.get("route"),
        sentinel
      });
    }

    if (url.pathname === "/api/detail") {
      detailCount += 1;
      return json({
        label: `real backend astro detail #${detailCount} · Reykjavík Zürich 台北`,
        sentinel
      });
    }

    if (url.pathname === "/oauth/start") {
      const redirectUrl = new URL("/callback", frontendOrigin);
      redirectUrl.searchParams.set("code", "astro-secret-code-8149");
      redirectUrl.searchParams.set("SESSION_TOKEN", "astro-session-token-8149");
      redirectUrl.searchParams.set("state", "astro-state-ok");
      redirectUrl.searchParams.set("plain", "kept");
      redirectUrl.hash = "id_token=astro-id-token-8149&plainHash=kept";
      return Response.redirect(redirectUrl.toString(), 302);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders() });
  },
  websocket: {
    open(ws) {
      ws.send(JSON.stringify({ label: "real backend astro websocket", sentinel }));
    },
    message() {}
  }
});

console.log(`astro island backend listening on http://127.0.0.1:${server.port}`);
