import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Bookmark } from "../_libs/lucide-react.mjs";
import { o as formatRef } from "./meta-CEOSKXSE.mjs";
import { n as useSeekStore, t as Button } from "./store-W265HU14.mjs";
import { t as useHydrated } from "./use-hydrated-BRQLb_xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-BTL74j3Z.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const saved = useSeekStore((s) => s.saved);
	const toggleSaved = useSeekStore((s) => s.toggleSaved);
	const hydrated = useHydrated();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-8 sm:pt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "Saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-lg font-sans text-sm text-muted",
				children: "Verses you keep on this device. Nothing is sent away."
			}),
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-8 max-w-2xl space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 animate-pulse rounded-xl bg-wash" })
			}) : saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl border border-line bg-surface px-6 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "mx-auto size-6 text-faint" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-xl text-ink",
						children: "No saved verses yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-sm text-muted",
						children: "Tap the bookmark beside a verse while you read or search."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Search the Bible"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-8 max-w-2xl space-y-3",
				children: saved.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-surface p-5 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/read/$book/$chapter",
							params: {
								book: v.slug,
								chapter: String(v.chapter)
							},
							hash: `v${v.verse}`,
							className: "font-serif text-lg font-medium text-ink underline-offset-4 hover:underline",
							children: formatRef(v.book, v.chapter, v.verse)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 px-2 font-sans text-xs text-muted hover:text-ink",
							onClick: () => toggleSaved(v),
							children: "Remove"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-lg leading-relaxed text-ink",
						children: v.text
					})]
				}, `${v.slug}:${v.chapter}:${v.verse}`))
			})
		]
	});
}
//#endregion
export { SavedPage as component };
