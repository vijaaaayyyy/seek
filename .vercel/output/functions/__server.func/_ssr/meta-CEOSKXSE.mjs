import { t as BOOKS } from "./books-_MFPmyl3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meta-CEOSKXSE.js
var OT_BOOKS = BOOKS.filter((b) => b.testament === "OT");
var NT_BOOKS = BOOKS.filter((b) => b.testament === "NT");
var bySlug = new Map(BOOKS.map((b) => [b.slug, b]));
var byName = new Map(BOOKS.map((b) => [b.name.toLowerCase(), b]));
function bookBySlug(slug) {
	return bySlug.get(slug.toLowerCase());
}
function bookByName(name) {
	return byName.get(name.toLowerCase()) ?? bySlug.get(slugify(name));
}
function slugify(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function formatRef(book, chapter, verse, endVerse) {
	const name = typeof book === "string" ? book : book.name;
	if (!verse) return `${name} ${chapter}`;
	if (endVerse && endVerse !== verse) return `${name} ${chapter}:${verse}–${endVerse}`;
	return `${name} ${chapter}:${verse}`;
}
function compact(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
var ALIASES = (() => {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const book of BOOKS) {
		const keys = [
			book.name,
			book.abbrev,
			book.slug.replace(/-/g, " "),
			...book.aliases
		];
		for (const key of keys) {
			const alias = compact(key);
			if (!alias || seen.has(alias)) continue;
			seen.add(alias);
			out.push({
				alias,
				book,
				short: alias.replace(/\s/g, "").length <= 2
			});
		}
	}
	out.sort((a, b) => b.alias.length - a.alias.length);
	return out;
})();
//#endregion
export { bookBySlug as a, bookByName as i, NT_BOOKS as n, formatRef as o, OT_BOOKS as r, ALIASES as t };
