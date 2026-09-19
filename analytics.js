(() => {
  const config = window.SITE_ANALYTICS || {};
  const status = document.querySelector("#analytics-status");
  const link = document.querySelector("#analytics-link");
  const total = document.querySelector("#visitor-total");
  const count = document.querySelector("#visitor-count");

  function cloudUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "cloud.umami.is" && !url.username && !url.password ? url : null;
    } catch {
      return null;
    }
  }

  const scriptUrl = cloudUrl(config.scriptUrl);
  const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.websiteId || "");
  // Local previews and file:// visits must not inflate the public statistics.
  if (validId && scriptUrl && location.protocol === "https:" && location.hostname === config.productionHostname) {
    const tracker = document.createElement("script");
    tracker.src = scriptUrl.href;
    tracker.defer = true;
    tracker.dataset.websiteId = config.websiteId;
    tracker.dataset.domains = config.productionHostname;
    document.head.append(tracker);
  }

  const shareUrl = cloudUrl(config.shareUrl);
  if (!shareUrl || !/^\/(?:analytics\/(?:us|eu)\/)?share\/[^/]+\/?$/.test(shareUrl.pathname)) {
    total.hidden = true;
    document.querySelector("#visitor-map").hidden = true;
    if (config.shareUrl) status.textContent = "Visitor statistics are temporarily unavailable.";
    else status.textContent = "Public statistics are not available yet.";
    return;
  }

  shareUrl.searchParams.set("date", "30day");
  shareUrl.searchParams.set("theme", "light");
  link.href = shareUrl.href;
  const parts = shareUrl.pathname.split("/share/");
  const base = `${shareUrl.origin}${parts[0]}/api`;
  const slug = parts[1].replace(/\/$/, "");

  async function load() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const get = async (path, headers = {}) => {
      const response = await fetch(base + path, {
        headers, signal: controller.signal, credentials: "omit", cache: "no-store"
      });
      if (!response.ok) throw new Error("Statistics unavailable");
      return response.json();
    };

    try {
      // Read-only share credentials stay in memory. No account or API key is used.
      const share = await get(`/share/${encodeURIComponent(slug)}`);
      if (!validId || share.websiteId !== config.websiteId || !share.token || !share.parameters?.overview) {
        throw new Error("Public overview is unavailable");
      }
      const end = Date.now();
      const period = new URLSearchParams({ startAt: String(end - 30 * 86400000), endAt: String(end) });
      const headers = { "x-umami-share-token": share.token, "x-umami-share-context": "1" };
      const [stats, locations] = await Promise.all([
        get(`/websites/${config.websiteId}/stats?${period}`, headers),
        get(`/websites/${config.websiteId}/metrics?${period}&type=country&limit=300`, headers)
      ]);
      if (!Number.isSafeInteger(stats.visitors) || stats.visitors < 0 || !Array.isArray(locations)
        || locations.some(row => !row || !Number.isSafeInteger(row.y) || row.y < 0)) {
        throw new Error("Invalid statistics");
      }
      const countries = locations.map(({ x, y }) => ({ x: /^[A-Z]{2}$/.test(x) ? x : "", y }));
      window.renderVisitorMap(countries);
      count.textContent = new Intl.NumberFormat("en").format(stats.visitors);
      document.querySelector("#visitor-period").textContent = `${stats.visitors === 1 ? "visitor" : "visitors"} in the last 30 days`;
      total.hidden = false;
      status.hidden = true;
    } catch {
      status.textContent = "Visitor statistics are temporarily unavailable.";
      status.hidden = false;
      total.hidden = true;
      document.querySelector("#visitor-map").hidden = true;
      link.hidden = false;
    } finally {
      clearTimeout(timer);
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: "200px" });
    observer.observe(document.querySelector("#visitors"));
  } else {
    load();
  }
})();
