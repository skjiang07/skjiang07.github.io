# Shangkun Jiang's website

Static academic website for https://skjiang07.github.io. No build step.

## Edit

- `index.html`: biography, research, publications, appointments, and service.
- `styles.css`: colors, typography, and layout. Color variables are at the top.
- `assets/avatar-photo.jpg`: sidebar portrait.
- `assets/profile-photo.png`: About photo.
- `files/Shangkun_Jiang_CV.pdf`: downloadable CV. Replace using the same name.
- `analytics-config.js`: public Umami settings. Never include API keys or passwords.
- `visitor-map.js`: the compact world map. Geographic data and pinned D3 libraries are in `assets/`.

Double-click `index.html` to preview the page. The visitor section reads aggregate data through the public Share API; it no longer embeds an Umami page. Local previews are not counted.

You can also serve the website over HTTP and open it in Chrome:

```sh
cd /Users/shangkun/Desktop/skjiang07.github.io
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/#visitors`. Keep the terminal running during the preview; press Ctrl+C to stop. If port 8000 is occupied, use another port in both the command and the URL. This starts a local preview, not a public deployment.

## Connect Umami

1. Create an account at https://cloud.umami.is/signup and add the domain `skjiang07.github.io`.
2. Under the website's Tracking code, copy `data-website-id` into `websiteId` and the script `src` into `scriptUrl` in `analytics-config.js`.
3. Enable a public Share URL for this website. Open it and copy the final address after any redirect into `shareUrl` (for this account, `https://cloud.umami.is/analytics/us/share/...`). The short `/share/...` address redirects without preserving the date filter.
4. Enable only the **Overview** view on the website's share. The widget uses its public read-only credentials to request the visitor total and aggregate country counts. No account password or API key is needed, stored, or published. Board shares are not supported by this widget.
5. Publish and visit the live website. Confirm that the visit appears in Umami. The widget displays only the world map and visitor total for a rolling 30-day window (30 x 24 hours), with the same timestamps for both requests. Data refreshes when the page loads and the visitor section approaches the viewport.

Without settings, the page says statistics are not connected. It does not load tracking or show invented counts. Collection begins after connection and publishing; previous visits cannot be reconstructed. Visitors are an estimate, and locations are approximate. Data availability depends on your Umami plan and retention settings.

The public total comes from Umami's visitors metric, not a sum of country counts. The map uses country shading with hover and keyboard country labels; it is not a map of precise personal locations. Countries too small for this world-scale map may not have a visible polygon. Failed or malformed responses show an unavailable message and a public statistics link, never a fabricated zero. Geographic data and D3 are local assets; runtime analytics requests go only to Umami Cloud.

The share-token and website stats/metrics endpoints are the same public endpoints used by Umami's share page. They allow cross-origin reads today; if Umami changes this contract, the widget will show its unavailable state. Live tracking still requires publishing to `https://skjiang07.github.io`.

Official references: [tracking](https://docs.umami.is/docs/collect-data), [sharing](https://docs.umami.is/docs/enable-share-url), [public share credentials](https://github.com/umami-software/umami/blob/master/src/components/hooks/queries/useShareTokenQuery.ts), [API headers](https://github.com/umami-software/umami/blob/master/src/components/hooks/useApi.ts).

## Publish

Run inside `/Users/shangkun/Desktop/skjiang07.github.io`:

```sh
git status
git add index.html styles.css script.js analytics.js analytics-config.js visitor-map.js assets/world-countries.js assets/vendor files/Shangkun_Jiang_CV.pdf README.md .gitignore .nojekyll
git commit -m "Refresh academic website"
git push origin master
```

GitHub Pages should publish from `master` / root. Check the repository's Actions or Settings > Pages for deployment status. Pushing uploads changes; the site updates only after deployment succeeds.
