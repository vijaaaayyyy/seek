import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as useBible, i as cn, r as Route$1, s as getVerse } from "./router-FRflzf_r.mjs";
import { i as bookByName, o as formatRef } from "./meta-CEOSKXSE.mjs";
import { n as useSeekStore } from "./store-W265HU14.mjs";
import { t as Skeleton } from "./skeleton-DjqUov_v.mjs";
import { a as searchLocal, i as searchBooks, n as SearchBox, r as VerseCard, t as Badge } from "./search-s-23izdF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-Cx9wwdvm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchByMeaning = createServerFn({ method: "POST" }).validator((input) => {
	return { query: input.query.trim().slice(0, 220) };
}).handler(createSsrRpc("fe2b0aeb1c46ba1794976675d02183430706b641a48650df51472a630d68a82e"));
function SearchPage() {
	const { q } = Route$1.useSearch();
	const { bible, ready, error } = useBible();
	const rememberQuery = useSeekStore((s) => s.rememberQuery);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [meaning, setMeaning] = (0, import_react.useState)({ status: "idle" });
	(0, import_react.useEffect)(() => {
		if (q.trim().length >= 2) rememberQuery(q);
	}, [q, rememberQuery]);
	const local = (0, import_react.useMemo)(() => {
		if (!bible || q.trim().length < 2) return [];
		return searchLocal(bible, q, 36);
	}, [bible, q]);
	const books = (0, import_react.useMemo)(() => searchBooks(q, 6), [q]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const query = q.trim();
		if (query.length < 2) {
			setMeaning({ status: "idle" });
			return;
		}
		setMeaning({ status: "loading" });
		searchByMeaning({ data: { query } }).then((res) => {
			if (cancelled) return;
			if (res.ok) setMeaning({
				status: "ok",
				reading: res.reading,
				hits: res.results
			});
			else setMeaning({
				status: "err",
				error: res.error
			});
		}).catch(() => {
			if (!cancelled) setMeaning({
				status: "err",
				error: "Meaning search could not finish."
			});
		});
		return () => {
			cancelled = true;
		};
	}, [q]);
	const meaningCards = (0, import_react.useMemo)(() => {
		if (!bible || meaning.status !== "ok" || !meaning.hits) return [];
		const cards = [];
		const seen = /* @__PURE__ */ new Set();
		for (const hit of meaning.hits) {
			const book = bookByName(hit.book);
			if (!book) continue;
			const verse = getVerse(bible, book.index, hit.chapter, hit.verse);
			if (!verse || seen.has(verse.i)) continue;
			seen.add(verse.i);
			const range = hit.endVerse && hit.endVerse !== hit.verse ? formatRef(book, hit.chapter, hit.verse, hit.endVerse) : null;
			cards.push({
				verse,
				why: range ? `${range}. ${hit.why}` : hit.why
			});
		}
		return cards;
	}, [bible, meaning]);
	const wordingIds = new Set(local.map((h) => h.verse.i));
	const meaningOnly = meaningCards.filter((c) => !wordingIds.has(c.verse.i));
	const meaningIds = new Set(meaningCards.map((c) => c.verse.i));
	const showWording = tab === "all" || tab === "wording";
	const showMeaning = tab === "all" || tab === "meaning";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-6 sm:pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				initial: q,
				size: "md",
				onSubmitQuery: (next) => rememberQuery(next)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-sans text-sm text-muted",
				children: q.trim() ? "Wording matches appear at once. Meaning looks past the letters to what you intended." : "Search a fragment, a misspelling, or the thought behind a verse."
			})]
		}), q.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-6 max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						["all", "All"],
						["wording", "By wording"],
						["meaning", "By meaning"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: cn("h-10 rounded-full px-4 font-sans text-sm transition-colors", tab === id ? "bg-forest text-forest-fg" : "bg-wash text-muted hover:text-ink"),
						children: label
					}, id))
				}),
				meaning.status === "ok" && meaning.reading && showMeaning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 font-serif text-lg leading-snug text-ink italic",
					children: meaning.reading
				}),
				books.length > 0 && showWording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: books.map(({ book, reason }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/read/$book/$chapter",
						params: {
							book: book.slug,
							chapter: "1"
						},
						className: "inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 font-sans text-sm hover:border-forest/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-base",
							children: book.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: reason
						})]
					}, book.slug))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultSkeleton, {}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted",
							children: error
						}),
						ready && showWording && tab !== "meaning" && local.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerseCard, {
							verse: hit.verse,
							matched: hit.matched,
							reason: hit.reason,
							kind: hit.kind === "book" ? "reference" : hit.kind,
							query: q,
							alsoMeaning: meaningIds.has(hit.verse.i)
						}, `w-${hit.verse.i}`)),
						ready && showMeaning && meaning.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultSkeleton, {}),
						ready && showMeaning && meaning.status === "err" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-line bg-surface px-4 py-3 font-sans text-sm text-muted",
							children: meaning.error
						}),
						ready && tab === "meaning" && meaningCards.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerseCard, {
							verse: hit.verse,
							reason: hit.why,
							kind: "meaning",
							query: q
						}, `m-${hit.verse.i}`)),
						ready && tab === "all" && meaningOnly.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerseCard, {
							verse: hit.verse,
							reason: hit.why,
							kind: "meaning",
							query: q
						}, `m-${hit.verse.i}`)),
						ready && showWording && local.length === 0 && tab === "wording" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { query: q }),
						ready && tab === "all" && local.length === 0 && meaningOnly.length === 0 && meaning.status !== "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { query: q }),
						ready && tab === "meaning" && meaning.status === "ok" && meaningCards.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-line bg-surface px-4 py-6 text-center font-sans text-sm text-muted",
							children: "Nothing matched by meaning. Try a story, a feeling, or a shorter fragment."
						})
					]
				})
			]
		})]
	});
}
function ResultSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 w-full rounded-xl" })]
	});
}
function EmptyState({ query }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface px-5 py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-serif text-xl text-ink",
				children: [
					"No wording match for “",
					query,
					"”"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-sans text-sm text-muted",
				children: "Meaning search still looks for the intention behind those words."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "mt-4",
				children: "Try a shorter fragment"
			})
		]
	});
}
//#endregion
export { SearchPage as component };
