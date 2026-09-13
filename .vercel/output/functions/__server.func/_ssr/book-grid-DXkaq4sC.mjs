import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as NT_BOOKS, r as OT_BOOKS } from "./meta-CEOSKXSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-grid-DXkaq4sC.js
var import_jsx_runtime = require_jsx_runtime();
function BookLink({ book }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/read/$book/$chapter",
		params: {
			book: book.slug,
			chapter: "1"
		},
		className: "group flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-wash",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-serif text-[1.05rem] text-ink group-hover:text-forest",
			children: book.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-sans text-xs tabular-nums text-faint",
			children: book.chapters.length
		})]
	});
}
function BookGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-sans text-xs font-medium tracking-[0.18em] text-muted uppercase",
			children: "Old Testament"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-surface p-2",
			children: OT_BOOKS.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookLink, { book }, book.slug))
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-sans text-xs font-medium tracking-[0.18em] text-muted uppercase",
			children: "New Testament"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-surface p-2",
			children: NT_BOOKS.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookLink, { book }, book.slug))
		})] })]
	});
}
//#endregion
export { BookGrid as t };
