import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-FRflzf_r.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-W265HU14.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-forest text-forest-fg hover:opacity-90",
			secondary: "bg-wash text-ink hover:bg-line",
			outline: "border border-line bg-surface text-ink hover:bg-wash",
			ghost: "text-ink hover:bg-wash",
			link: "text-forest underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 rounded-md px-4",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var useSeekStore = create()(persist((set, get) => ({
	saved: [],
	recent: [],
	toggleSaved: (verse) => {
		const key = `${verse.slug}:${verse.chapter}:${verse.verse}`;
		set({ saved: get().saved.some((s) => `${s.slug}:${s.chapter}:${s.verse}` === key) ? get().saved.filter((s) => `${s.slug}:${s.chapter}:${s.verse}` !== key) : [{
			...verse,
			savedAt: Date.now()
		}, ...get().saved].slice(0, 200) });
	},
	isSaved: (slug, chapter, verse) => get().saved.some((s) => s.slug === slug && s.chapter === chapter && s.verse === verse),
	rememberQuery: (q) => {
		const query = q.trim();
		if (query.length < 2) return;
		set({ recent: [query, ...get().recent.filter((x) => x.toLowerCase() !== query.toLowerCase())].slice(0, 8) });
	},
	clearRecent: () => set({ recent: [] })
}), { name: "seek-bible" }));
//#endregion
export { useSeekStore as n, Button as t };
