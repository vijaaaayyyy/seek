import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/highlighted-HlKmDjbh.js
var import_jsx_runtime = require_jsx_runtime();
function Highlighted({ text, needles }) {
	const unique = [...new Set(needles.filter((n) => n && n.length > 1))];
	if (!unique.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
	const escaped = unique.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const re = new RegExp(`(${escaped.join("|")})`, "gi");
	const parts = text.split(re);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((part, i) => unique.some((n) => n.toLowerCase() === part.toLowerCase()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
		className: "rounded-xs bg-mark text-ink",
		children: part
	}, `${part}-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, `${part}-${i}`)) });
}
//#endregion
export { Highlighted as t };
