import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useBible } from "./router-FRflzf_r.mjs";
import { t as BookGrid } from "./book-grid-DXkaq4sC.mjs";
import { n as useSeekStore } from "./store-W265HU14.mjs";
import { a as searchLocal, n as SearchBox, r as VerseCard } from "./search-s-23izdF.mjs";
import { t as useHydrated } from "./use-hydrated-BRQLb_xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BAH-8AcJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAILY_VERSES = [
	{
		book: "John",
		slug: "john",
		chapter: 3,
		verse: 16,
		text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
	},
	{
		book: "Psalms",
		slug: "psalms",
		chapter: 23,
		verse: 1,
		text: "The LORD is my shepherd; I shall not want."
	},
	{
		book: "Genesis",
		slug: "genesis",
		chapter: 1,
		verse: 1,
		text: "In the beginning God created the heaven and the earth."
	},
	{
		book: "Romans",
		slug: "romans",
		chapter: 8,
		verse: 28,
		text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
	},
	{
		book: "Philippians",
		slug: "philippians",
		chapter: 4,
		verse: 13,
		text: "I can do all things through Christ which strengtheneth me."
	},
	{
		book: "Jeremiah",
		slug: "jeremiah",
		chapter: 29,
		verse: 11,
		text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."
	},
	{
		book: "Matthew",
		slug: "matthew",
		chapter: 11,
		verse: 28,
		text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest."
	},
	{
		book: "Isaiah",
		slug: "isaiah",
		chapter: 40,
		verse: 31,
		text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
	},
	{
		book: "Proverbs",
		slug: "proverbs",
		chapter: 3,
		verse: 5,
		text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
	},
	{
		book: "1 Corinthians",
		slug: "1-corinthians",
		chapter: 13,
		verse: 4,
		text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up."
	},
	{
		book: "Psalms",
		slug: "psalms",
		chapter: 46,
		verse: 10,
		text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth."
	},
	{
		book: "Joshua",
		slug: "joshua",
		chapter: 1,
		verse: 9,
		text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."
	},
	{
		book: "Romans",
		slug: "romans",
		chapter: 12,
		verse: 2,
		text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God."
	},
	{
		book: "Micah",
		slug: "micah",
		chapter: 6,
		verse: 8,
		text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"
	},
	{
		book: "Psalms",
		slug: "psalms",
		chapter: 119,
		verse: 105,
		text: "Thy word is a lamp unto my feet, and a light unto my path."
	},
	{
		book: "Matthew",
		slug: "matthew",
		chapter: 6,
		verse: 33,
		text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."
	},
	{
		book: "Isaiah",
		slug: "isaiah",
		chapter: 41,
		verse: 10,
		text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."
	},
	{
		book: "2 Timothy",
		slug: "2-timothy",
		chapter: 1,
		verse: 7,
		text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind."
	},
	{
		book: "John",
		slug: "john",
		chapter: 14,
		verse: 6,
		text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
	},
	{
		book: "Ephesians",
		slug: "ephesians",
		chapter: 2,
		verse: 8,
		text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:"
	},
	{
		book: "Psalms",
		slug: "psalms",
		chapter: 27,
		verse: 1,
		text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?"
	},
	{
		book: "Hebrews",
		slug: "hebrews",
		chapter: 11,
		verse: 1,
		text: "Now faith is the substance of things hoped for, the evidence of things not seen."
	},
	{
		book: "1 John",
		slug: "1-john",
		chapter: 4,
		verse: 8,
		text: "He that loveth not knoweth not God; for God is love."
	},
	{
		book: "Matthew",
		slug: "matthew",
		chapter: 5,
		verse: 14,
		text: "Ye are the light of the world. A city that is set on an hill cannot be hid."
	},
	{
		book: "Isaiah",
		slug: "isaiah",
		chapter: 9,
		verse: 6,
		text: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace."
	},
	{
		book: "John",
		slug: "john",
		chapter: 1,
		verse: 1,
		text: "In the beginning was the Word, and the Word was with God, and the Word was God."
	},
	{
		book: "Revelation",
		slug: "revelation",
		chapter: 21,
		verse: 4,
		text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away."
	},
	{
		book: "Galatians",
		slug: "galatians",
		chapter: 5,
		verse: 22,
		text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,"
	},
	{
		book: "Psalms",
		slug: "psalms",
		chapter: 19,
		verse: 1,
		text: "The heavens declare the glory of God; and the firmament sheweth his handywork."
	},
	{
		book: "Joshua",
		slug: "joshua",
		chapter: 24,
		verse: 15,
		text: "And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve."
	}
];
function verseOfTheDay(date = /* @__PURE__ */ new Date()) {
	const start = Date.UTC(date.getFullYear(), 0, 0);
	const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
	return DAILY_VERSES[Math.floor((now - start) / 864e5) % DAILY_VERSES.length];
}
var EXAMPLES = [
	{
		q: "begot",
		label: "begot"
	},
	{
		q: "walk on water",
		label: "walk on water"
	},
	{
		q: "comfort when I am afraid",
		label: "comfort when afraid"
	},
	{
		q: "prodigal son",
		label: "prodigal son"
	},
	{
		q: "valley of the shadow",
		label: "valley of the shadow"
	}
];
function Home() {
	const daily = verseOfTheDay();
	const { bible, ready } = useBible();
	const recent = useSeekStore((s) => s.recent);
	const rememberQuery = useSeekStore((s) => s.rememberQuery);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const [live, setLive] = (0, import_react.useState)("");
	const preview = (0, import_react.useMemo)(() => {
		if (!bible || live.trim().length < 3) return [];
		return searchLocal(bible, live, 4);
	}, [bible, live]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-10 sm:pt-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs font-medium tracking-widest text-muted uppercase",
						children: "The whole Bible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl",
						children: "Find the verse you only half remember"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-lg font-sans text-base leading-relaxed text-muted",
						children: "Type a fragment of a word, a feeling, or a story. Seek finds the place in Scripture — even when the exact wording is gone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
							autoFocus: true,
							onSubmitQuery: (q) => rememberQuery(q),
							onValueChange: setLive
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								rememberQuery(ex.q);
								navigate({
									to: "/search",
									search: { q: ex.q }
								});
							},
							className: "rounded-full border border-line bg-surface px-3 py-1.5 font-sans text-xs text-muted transition-colors hover:border-forest/30 hover:text-ink",
							children: ex.label
						}, ex.q))
					})
				]
			}),
			ready && preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto mt-8 max-w-2xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs tracking-widest text-muted uppercase",
					children: "Instant matches"
				}), preview.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerseCard, {
					verse: hit.verse,
					matched: hit.matched,
					reason: hit.reason,
					kind: hit.kind === "book" ? "reference" : hit.kind,
					query: live
				}, hit.verse.i))]
			}),
			hydrated && recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto mt-10 max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-sans text-xs tracking-widest text-muted uppercase",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: recent.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/search",
						search: { q },
						className: "rounded-full bg-wash px-3 py-1.5 font-sans text-sm text-ink hover:bg-line",
						children: q
					}, q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto mt-14 max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs tracking-widest text-muted uppercase",
					children: "Today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/read/$book/$chapter",
					params: {
						book: daily.slug,
						chapter: String(daily.chapter)
					},
					hash: `v${daily.verse}`,
					className: "mt-3 block rounded-xl border border-line bg-surface p-6 shadow-soft transition-colors hover:border-forest/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-serif text-lg font-medium text-ink",
						children: [
							daily.book,
							" ",
							daily.chapter,
							":",
							daily.verse
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-lg leading-relaxed text-ink",
						children: daily.text
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-medium tracking-tight",
						children: "The books"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-sans text-sm text-muted",
						children: "Sixty-six books. Open any chapter."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/books",
						className: "font-sans text-sm text-forest hover:underline",
						children: "Browse all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookGrid, {})]
			})
		]
	});
}
//#endregion
export { Home as component };
