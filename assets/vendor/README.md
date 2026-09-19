# Map assets

Vendored dependencies, with no CDN requests at runtime:

- d3-array 3.2.4, ISC: https://github.com/d3/d3-array/tree/v3.2.4
- d3-geo 3.1.1, ISC: https://github.com/d3/d3-geo/tree/v3.1.1
- Boundaries: Umami's `public/datamaps.world.json` (177 GeoJSON features), retrieved September 19, 2026. https://github.com/umami-software/umami/blob/master/public/datamaps.world.json
- ISO codes: i18n-iso-countries 7.14.0, MIT. https://github.com/michaelwittig/node-i18n-iso-countries

`../world-countries.js` is the boundary GeoJSON wrapped as a local script, with `properties.code` added by joining each feature's alpha-3 ID to the ISO alpha-2 code. Kosovo is mapped to XK; the unmatched Somaliland feature has no code and stays neutral. Antarctica is omitted when rendering. The original geometry is unchanged.

License texts are included alongside the libraries. Geographic boundaries are illustrative and do not imply a position on disputed borders.
