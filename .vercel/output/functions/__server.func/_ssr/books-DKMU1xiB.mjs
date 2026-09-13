import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Input } from "./input-PCieg0_m.mjs";
import { n as NT_BOOKS, r as OT_BOOKS } from "./meta-CEOSKXSE.mjs";
import { t as BookGrid } from "./book-grid-DXkaq4sC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books-DKMU1xiB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BooksPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		const match = (b) => !needle || b.name.toLowerCase().includes(needle) || b.abbrev.toLowerCase().includes(needle) || b.aliases.some((a) => a.toLowerCase().includes(needle));
		return {
			ot: OT_BOOKS.filter(match),
			nt: NT_BOOKS.filter(match)
		};
	}, [q]);
	const filtering = q.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-8 sm:pt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "Books"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-lg font-sans text-sm text-muted",
				children: "The King James Bible, complete. Open a book to begin reading."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter by name, like psalm or 1 cor"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: filtering ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookColumn, {
						title: "Old Testament",
						books: filtered.ot
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookColumn, {
						title: "New Testament",
						books: filtered.nt
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookGrid, {})
			})
		]
	});
}
function BookColumn({ title, books }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-3 font-sans text-xs font-medium tracking-widest text-muted uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface p-2",
		children: [books.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-3 py-4 font-sans text-sm text-muted",
			children: "No books match."
		}), books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/read/$book/$chapter",
			params: {
				book: book.slug,
				chapter: "1"
			},
			className: "flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-wash",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-serif text-lg text-ink",
				children: book.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-xs text-faint tabular-nums",
				children: book.chapters.length
			})]
		}, book.slug))]
	})] });
}
//#endregion
export { BooksPage as component };
