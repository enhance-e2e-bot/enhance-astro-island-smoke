import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function IslandPanel({ backendUrl, copy }) {
  const [account, setAccount] = useState("loading backend account");
  const [detail, setDetail] = useState("loading backend detail");
  const [eventLabel, setEventLabel] = useState("waiting for backend event");
  const [socketLabel, setSocketLabel] = useState("waiting for backend websocket");
  const [focusValue, setFocusValue] = useState("");
  const [portalHost, setPortalHost] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const accountResponse = await fetch(`${backendUrl}/api/account?route=${encodeURIComponent(location.pathname + location.search + location.hash)}`);
      const accountData = await accountResponse.json();
      const detailResponse = await fetch(`${backendUrl}/api/detail`);
      const detailData = await detailResponse.json();
      if (!cancelled) {
        setAccount(accountData.label);
        setDetail(detailData.label);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  useEffect(() => {
    const source = new EventSource(`${backendUrl}/events`);
    source.addEventListener("message", (event) => {
      setEventLabel(JSON.parse(event.data).label);
    });
    return () => source.close();
  }, [backendUrl]);

  useEffect(() => {
    const socket = new WebSocket(`${backendUrl.replace("http", "ws")}/socket`);
    socket.addEventListener("message", (event) => {
      setSocketLabel(JSON.parse(event.data).label);
    });
    return () => socket.close();
  }, [backendUrl]);

  useEffect(() => {
    const host = document.createElement("div");
    host.id = "astro-island-portal-host";
    document.body.append(host);
    setPortalHost(host);
    return () => host.remove();
  }, []);

  const duplicateItems = [
    { id: "first", label: "Astro island duplicate first" },
    { id: "second", label: copy.duplicateSecond },
    { id: "third", label: copy.duplicateThird }
  ];

  return (
    <section className="panel island-panel" data-testid="astro-react-island-panel">
      <h2 id="astro-island-heading">React island</h2>
      <p id="backend-account">{account}</p>
      <p id="backend-detail">{detail}</p>
      <p id="backend-event">{eventLabel}</p>
      <p id="backend-socket">{socketLabel}</p>

      <label htmlFor="astro-focus-probe">Focus probe</label>
      <input
        id="astro-focus-probe"
        value={focusValue}
        onChange={(event) => setFocusValue(event.currentTarget.value)}
      />
      <p id="astro-focus-result">page input: {focusValue || "empty"}</p>
      <button id="astro-after-focus" type="button">After focus target</button>

      <ul className="actions">
        {duplicateItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="astro-island-duplicate"
              data-testid="astro-island-duplicate"
              data-action-id={item.id}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {portalHost
        ? createPortal(
            <button id="astro-island-portal-action" type="button" data-testid="astro:portal/[action]">
              {copy.islandPortal}
            </button>,
            portalHost
          )
        : null}
    </section>
  );
}
