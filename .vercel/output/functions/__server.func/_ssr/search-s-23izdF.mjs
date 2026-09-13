import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as BOOKS } from "./books-_MFPmyl3.mjs";
import { c as Bookmark, i as Copy, l as BookmarkCheck, r as Search } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as normalize, i as cn } from "./router-FRflzf_r.mjs";
import { t as Input } from "./input-PCieg0_m.mjs";
import { o as formatRef, t as ALIASES } from "./meta-CEOSKXSE.mjs";
import { n as useSeekStore, t as Button } from "./store-W265HU14.mjs";
import { t as Highlighted } from "./highlighted-HlKmDjbh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-s-23izdF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HINTS = [
	"a word you half remember",
	"begot, or begotten",
	"the boy who left home",
	"comfort when I am afraid",
	"walk on water"
];
function SearchBox({ initial = "", size = "lg", autoFocus = false, onSubmitQuery, onValueChange }) {
	const navigate = useNavigate();
	const id = (0, import_react.useId)();
	const [value, setValue] = (0, import_react.useState)(initial);
	const [hint, setHint] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setValue(initial);
	}, [initial]);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setHint((h) => (h + 1) % HINTS.length), 4200);
		return () => window.clearInterval(t);
	}, []);
	function submit(e) {
		e.preventDefault();
		const q = value.trim();
		if (!q) return;
		onSubmitQuery?.(q);
		navigate({
			to: "/search",
			search: { q }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: id,
			className: "sr-only",
			children: "Search the Bible"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id,
					value,
					autoFocus,
					autoComplete: "off",
					autoCorrect: "off",
					spellCheck: false,
					placeholder: HINTS[hint],
					onChange: (e) => {
						setValue(e.target.value);
						onValueChange?.(e.target.value);
					},
					className: cn("pr-24 pl-11", size === "lg" && "h-14 rounded-xl text-lg shadow-soft", size === "md" && "h-12 rounded-lg")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "absolute top-1/2 right-2 inline-flex h-10 -translate-y-1/2 items-center rounded-md bg-forest px-3 font-sans text-sm font-medium text-forest-fg transition-opacity hover:opacity-90",
					children: "Search"
				})
			]
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-wash text-muted",
		forest: "border-transparent bg-forest/10 text-forest",
		outline: "border-line text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function VerseCard({ verse, matched = [], reason, kind, query, alsoMeaning }) {
	const book = BOOKS[verse.bookIndex];
	const saved = useSeekStore((s) => s.isSaved(book.slug, verse.chapter, verse.verse));
	const toggleSaved = useSeekStore((s) => s.toggleSaved);
	const citation = formatRef(book, verse.chapter, verse.verse);
	async function copyVerse() {
		const blob = `${citation} — ${verse.text}`;
		try {
			await navigator.clipboard.writeText(blob);
			toast("Copied verse");
		} catch {
			toast("Could not copy");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/read/$book/$chapter",
						params: {
							book: book.slug,
							chapter: String(verse.chapter)
						},
						search: query ? { q: query } : void 0,
						hash: `v${verse.verse}`,
						className: "font-serif text-lg font-medium tracking-tight text-ink underline-offset-4 hover:underline",
						children: citation
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 font-sans text-xs tracking-wide text-muted",
						children: book.testament === "OT" ? "Old Testament" : "New Testament"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": "Copy verse",
						onClick: copyVerse,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						"aria-label": saved ? "Remove from saved" : "Save verse",
						onClick: () => toggleSaved({
							book: book.name,
							slug: book.slug,
							chapter: verse.chapter,
							verse: verse.verse,
							text: verse.text
						}),
						children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-serif text-lg leading-relaxed text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighted, {
					text: verse.text,
					needles: matched
				})
			}),
			(kind || reason) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					kind === "meaning" || alsoMeaning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "forest",
						children: "By meaning"
					}) : null,
					kind === "wording" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "By wording" }) : null,
					kind === "reference" || kind === "book" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "forest",
						children: "This place"
					}) : null,
					reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans text-xs text-muted",
						children: reason
					})
				]
			})
		]
	});
}
function parseReference(raw) {
	const q = normalize(raw);
	if (!q) return null;
	for (const { alias, book, short } of ALIASES) {
		if (q === alias) {
			if (short) continue;
			return {
				book,
				chapter: null,
				verse: null,
				endVerse: null
			};
		}
		const prefix = alias + " ";
		if (!q.startsWith(prefix)) continue;
		const m = q.slice(prefix.length).trim().match(/^(\d+)(?:\s+(\d+))?(?:\s+(\d+))?$/);
		if (!m) continue;
		const chapter = Number(m[1]);
		const verse = m[2] ? Number(m[2]) : null;
		const endVerse = m[3] ? Number(m[3]) : null;
		if (!Number.isFinite(chapter) || chapter < 1) continue;
		if (chapter > book.chapters.length) continue;
		const maxVerse = book.chapters[chapter - 1] ?? 0;
		if (verse && verse > maxVerse) continue;
		return {
			book,
			chapter,
			verse,
			endVerse
		};
	}
	return null;
}
var STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"of",
	"to",
	"a",
	"an",
	"in",
	"that",
	"is",
	"was",
	"it",
	"with",
	"for",
	"from",
	"by",
	"as",
	"on",
	"at",
	"or",
	"be",
	"he",
	"his",
	"him",
	"i",
	"my"
]);
var SYNONYMS = {
	love: ["charity"],
	charity: ["love"],
	spirit: ["ghost"],
	ghost: ["spirit"],
	jesus: ["christ"],
	christ: ["jesus"],
	church: ["congregation"],
	congregation: ["church"]
};
function expand(token) {
	const extra = SYNONYMS[token];
	return extra ? [token, ...extra] : [token];
}
function editDistanceOne(a, b) {
	const la = a.length;
	const lb = b.length;
	if (Math.abs(la - lb) > 1) return false;
	if (a === b) return true;
	if (la === lb) {
		let d = 0;
		for (let i = 0; i < la; i++) if (a[i] !== b[i] && ++d > 1) return false;
		return true;
	}
	const longer = la > lb ? a : b;
	const shorter = la > lb ? b : a;
	let i = 0;
	let j = 0;
	let d = 0;
	while (i < longer.length) if (j < shorter.length && longer[i] === shorter[j]) {
		i++;
		j++;
	} else {
		if (++d > 1) return false;
		i++;
	}
	return true;
}
function matchToken(token, words) {
	let best = null;
	const consider = (score, word) => {
		if (!best || score > best.score) best = {
			score,
			word
		};
	};
	for (const word of words) {
		if (word === token) {
			consider(24, word);
			continue;
		}
		if (token.length >= 3 && word.startsWith(token)) {
			consider(word.length - token.length <= 5 ? 16 : 10, word);
			continue;
		}
		if (token.length >= 4 && word.endsWith(token)) {
			consider(14, word);
			continue;
		}
		if (token.length >= 5 && word.includes(token)) {
			consider(9, word);
			continue;
		}
		if (token.length >= 5 && Math.abs(word.length - token.length) <= 1 && editDistanceOne(token, word)) consider(12, word);
	}
	return best;
}
function proximityBonus(positions) {
	if (positions.length < 2) return 0;
	const sorted = [...positions].sort((a, b) => a - b);
	let best = 99;
	for (let i = 1; i < sorted.length; i++) best = Math.min(best, sorted[i] - sorted[i - 1]);
	if (best <= 2) return 18;
	if (best <= 6) return 10;
	if (best <= 12) return 4;
	return 0;
}
function candidateIds(bible, tokens) {
	const buckets = [];
	for (const token of tokens) {
		if (token.length < 3) return bible.verses;
		const keys = new Set(expand(token).map((t) => t.slice(0, 3)));
		const merged = [];
		const seen = /* @__PURE__ */ new Set();
		for (const key of keys) {
			const bucket = bible.prefixIndex.get(key);
			if (!bucket) continue;
			for (const id of bucket) if (!seen.has(id)) {
				seen.add(id);
				merged.push(id);
			}
		}
		if (!merged.length) return [];
		buckets.push(merged);
	}
	if (!buckets.length) return bible.verses;
	buckets.sort((a, b) => a.length - b.length);
	const first = buckets[0];
	if (buckets.length === 1) return first.map((id) => bible.verses[id]);
	const rest = buckets.slice(1).map((b) => new Set(b));
	const out = [];
	for (const id of first) if (rest.every((set) => set.has(id))) out.push(bible.verses[id]);
	return out;
}
function searchLocal(bible, query, limit = 40) {
	const trimmed = query.trim();
	if (!trimmed) return [];
	const hits = [];
	const ref = parseReference(trimmed);
	if (ref) {
		if (ref.chapter && ref.verse) {
			const start = ref.verse;
			const end = ref.endVerse && ref.endVerse > start ? ref.endVerse : start;
			for (let v = start; v <= end; v++) {
				const verse = bible.verses.find((item) => item.bookIndex === ref.book.index && item.chapter === ref.chapter && item.verse === v);
				if (verse) hits.push({
					verse,
					score: 1e3 - (v - start),
					kind: "reference",
					matched: [],
					reason: "Opened this place from the reference you typed."
				});
			}
		} else if (ref.chapter) bible.verses.filter((item) => item.bookIndex === ref.book.index && item.chapter === ref.chapter).slice(0, 8).forEach((verse, i) => {
			hits.push({
				verse,
				score: 900 - i,
				kind: "reference",
				matched: [],
				reason: `Opening ${ref.book.name} ${ref.chapter}.`
			});
		});
		else {
			const first = bible.verses.find((item) => item.bookIndex === ref.book.index);
			if (first) hits.push({
				verse: first,
				score: 850,
				kind: "book",
				matched: [],
				reason: `The book of ${ref.book.name}.`
			});
		}
	}
	const tokens = normalize(trimmed).split(" ").filter(Boolean);
	if (!tokens.length) return hits.slice(0, limit);
	const contentTokens = tokens.filter((t) => !STOP.has(t) && t.length > 1);
	const required = contentTokens.length ? contentTokens : tokens.filter((t) => t.length > 1);
	if (!required.length) return hits.slice(0, limit);
	const expanded = required.map((t) => expand(t));
	const phrase = required.join(" ");
	const pool = candidateIds(bible, required);
	const already = new Set(hits.map((h) => h.verse.i));
	for (const verse of pool) {
		if (already.has(verse.i)) continue;
		let score = 0;
		const matched = /* @__PURE__ */ new Set();
		const positions = [];
		let missed = 0;
		if (phrase.length >= 6 && verse.norm.includes(phrase)) score += 80 + Math.min(phrase.length, 40);
		for (const variants of expanded) {
			let best = null;
			let bestPos = -1;
			for (const token of variants) {
				if (token.length <= 1) continue;
				const found = matchToken(token, verse.words);
				if (found && (!best || found.score > best.score)) {
					best = found;
					bestPos = verse.words.indexOf(found.word);
				}
			}
			if (!best) {
				missed += 1;
				continue;
			}
			score += best.score;
			matched.add(best.word);
			if (bestPos >= 0) positions.push(bestPos);
		}
		if (!matched.size) continue;
		if (required.length >= 2 && missed > Math.floor(required.length / 2)) continue;
		if (required.length === 1 && missed > 0) continue;
		score += proximityBonus(positions);
		if (required.length >= 2 && missed === 0) score += 16;
		const words = [...matched];
		hits.push({
			verse,
			score,
			kind: "wording",
			matched: words,
			reason: words.length === 1 ? `Remembers “${words[0]}”` : `Remembers ${words.slice(0, 3).map((w) => `“${w}”`).join(", ")}`
		});
	}
	hits.sort((a, b) => b.score - a.score || a.verse.i - b.verse.i);
	return hits.slice(0, limit);
}
function searchBooks(query, limit = 8) {
	const q = normalize(query);
	if (q.length < 2) return [];
	const out = [];
	for (const book of BOOKS) {
		const name = normalize(book.name);
		const slug = normalize(book.slug.replace(/-/g, " "));
		if (name === q || slug === q || book.aliases.some((a) => normalize(a) === q)) {
			out.push({
				book,
				reason: "This book"
			});
			continue;
		}
		if (name.startsWith(q) || slug.startsWith(q) || book.abbrev.toLowerCase().startsWith(q)) out.push({
			book,
			reason: "Book name"
		});
	}
	return out.slice(0, limit);
}
//#endregion
export { searchLocal as a, searchBooks as i, SearchBox as n, VerseCard as r, Badge as t };
