import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as BOOKS } from "./books-_MFPmyl3.mjs";
import { a as ChevronRight, c as Bookmark, l as BookmarkCheck, o as ChevronLeft, s as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBible, c as normalize, i as cn, n as Route, o as getChapter } from "./router-FRflzf_r.mjs";
import { t as Input } from "./input-PCieg0_m.mjs";
import { a as bookBySlug, n as NT_BOOKS, o as formatRef, r as OT_BOOKS } from "./meta-CEOSKXSE.mjs";
import { n as useSeekStore, t as Button } from "./store-W265HU14.mjs";
import { t as Highlighted } from "./highlighted-HlKmDjbh.mjs";
import { t as Skeleton } from "./skeleton-DjqUov_v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read._book._chapter-ekwe2X3n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
		className: cn("fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex flex-col bg-paper text-ink shadow-soft duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out", side === "right" && "inset-y-0 right-0 h-full w-full max-w-md border-l border-line data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", side === "left" && "inset-y-0 left-0 h-full w-full max-w-md border-r border-line data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl border-t border-line data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-wash hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-6 pr-14", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("font-serif text-xl font-medium tracking-tight text-ink", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		className: cn("font-sans text-sm text-muted", className),
		...props
	});
}
function BookPicker({ book, chapter }) {
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [picking, setPicking] = (0, import_react.useState)(book);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		const match = (b) => !needle || b.name.toLowerCase().includes(needle) || b.abbrev.toLowerCase().includes(needle) || b.aliases.some((a) => a.toLowerCase().includes(needle));
		return {
			ot: OT_BOOKS.filter(match),
			nt: NT_BOOKS.filter(match)
		};
	}, [q]);
	function go(next, ch) {
		setOpen(false);
		navigate({
			to: "/read/$book/$chapter",
			params: {
				book: next.slug,
				chapter: String(ch)
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (next) {
				setPicking(book);
				setQ("");
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-wash",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-serif text-xl font-medium tracking-tight sm:text-2xl",
					children: [
						book.name,
						" ",
						chapter
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "bottom",
			className: "gap-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Choose a place" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
				picking.name,
				" has ",
				picking.chapters.length,
				" chapters."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter books",
					className: "h-11"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-h-0 flex-1 gap-4 overflow-y-auto md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 font-sans text-xs tracking-[0.16em] text-muted uppercase",
						children: "Books"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col",
						children: [...filtered.ot, ...filtered.nt].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPicking(b),
							className: cn("rounded-md px-3 py-2 text-left font-serif text-base transition-colors", picking.slug === b.slug ? "bg-wash text-ink" : "text-ink hover:bg-wash"),
							children: b.name
						}, b.slug))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 font-sans text-xs tracking-[0.16em] text-muted uppercase",
						children: "Chapters"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-6 gap-1 sm:grid-cols-8",
						children: picking.chapters.map((_, i) => {
							const n = i + 1;
							const current = picking.slug === book.slug && n === chapter;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => go(picking, n),
								className: cn("inline-flex h-11 items-center justify-center rounded-md font-sans text-sm tabular-nums transition-colors", current ? "bg-forest text-forest-fg" : "bg-wash text-ink hover:bg-line"),
								children: n
							}, n);
						})
					})] })]
				})]
			})]
		})]
	});
}
function ChapterReader({ book, chapter, verses, highlight = [], focusVerse }) {
	const saved = useSeekStore((s) => s.saved);
	const toggleSaved = useSeekStore((s) => s.toggleSaved);
	const prev = adjacentChapter(book, chapter, -1);
	const next = adjacentChapter(book, chapter, 1);
	(0, import_react.useEffect)(() => {
		if (!focusVerse) return;
		const el = document.getElementById(`v${focusVerse}`);
		if (el) el.scrollIntoView({
			block: "center",
			behavior: "smooth"
		});
	}, [
		focusVerse,
		book.slug,
		chapter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-14 z-20 -mx-4 flex items-center justify-between gap-2 border-b border-line/70 bg-paper/95 px-4 py-2 backdrop-blur-sm sm:top-16 sm:mx-0 sm:rounded-xl sm:border sm:px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookPicker, {
					book,
					chapter
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-2 font-sans text-xs text-muted",
					children: [
						book.testament === "OT" ? "Old Testament" : "New Testament",
						" · ",
						verses.length,
						" verses"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-1",
				children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/read/$book/$chapter",
						params: {
							book: prev.slug,
							chapter: String(prev.chapter)
						},
						"aria-label": "Previous chapter",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					disabled: true,
					"aria-label": "Previous chapter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
				}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/read/$book/$chapter",
						params: {
							book: next.slug,
							chapter: String(next.chapter)
						},
						"aria-label": "Next chapter",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					disabled: true,
					"aria-label": "Next chapter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto mt-8 max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "sr-only",
				children: [
					book.name,
					" ",
					chapter
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-serif text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed",
				children: verses.map((v) => {
					const isSaved = saved.some((s) => s.slug === book.slug && s.chapter === v.chapter && s.verse === v.verse);
					const focused = focusVerse === v.verse;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						id: `v${v.verse}`,
						className: cn("group relative -mx-2 mb-3 rounded-md px-2 py-1", focused && "bg-mark/70"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mr-1.5 align-super font-sans text-xs font-medium text-muted tabular-nums hover:text-forest",
								onClick: async () => {
									const citation = formatRef(book, v.chapter, v.verse);
									try {
										await navigator.clipboard.writeText(`${citation} — ${v.text}`);
										toast("Copied verse");
									} catch {
										toast("Could not copy");
									}
								},
								"aria-label": `Copy ${formatRef(book, v.chapter, v.verse)}`,
								children: v.verse
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighted, {
								text: v.text,
								needles: highlight
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("ml-2 inline-flex size-7 translate-y-0.5 items-center justify-center rounded-sm text-faint opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100", isSaved && "text-forest opacity-100"),
								"aria-label": isSaved ? "Remove from saved" : "Save verse",
								onClick: () => toggleSaved({
									book: book.name,
									slug: book.slug,
									chapter: v.chapter,
									verse: v.verse,
									text: v.text
								}),
								children: isSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-3.5" })
							})
						]
					}, v.verse);
				})
			})]
		})]
	});
}
function adjacentChapter(book, chapter, dir) {
	const nextNum = chapter + dir;
	if (nextNum >= 1 && nextNum <= book.chapters.length) return {
		slug: book.slug,
		chapter: nextNum
	};
	const neighbor = BOOKS[book.index + dir];
	if (!neighbor) return null;
	return {
		slug: neighbor.slug,
		chapter: dir === 1 ? 1 : neighbor.chapters.length
	};
}
function ReadPage() {
	const { book: slug, chapter: chapterParam } = Route.useParams();
	const { q } = Route.useSearch();
	const hash = useRouterState({ select: (s) => s.location.hash });
	const { bible, ready, error } = useBible();
	const book = bookBySlug(slug);
	const chapter = Number(chapterParam);
	if (!book || !Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl",
				children: "That place is not in this Bible"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-sans text-sm text-muted",
				children: "Check the book name and chapter, or return to the list."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/books",
				className: "mt-6 inline-block font-sans text-sm text-forest hover:underline",
				children: "Browse books"
			})
		]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "pt-16 text-center font-sans text-sm text-muted",
		children: error
	});
	if (!ready || !bible) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-8 max-w-2xl space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-11/12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-10/12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-full" })
			]
		})]
	});
	const verses = getChapter(bible, book.index, chapter);
	const rawHash = hash.replace(/^#/, "");
	const parsed = rawHash.startsWith("v") ? Number(rawHash.slice(1)) : NaN;
	const highlight = q ? normalize(q).split(" ").filter((t) => t.length > 2) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChapterReader, {
			book,
			chapter,
			verses,
			highlight,
			focusVerse: Number.isFinite(parsed) ? parsed : void 0
		})
	});
}
//#endregion
export { ReadPage as component };
