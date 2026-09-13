import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./router-FRflzf_r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-PCieg0_m.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-12 w-full rounded-lg border border-line bg-surface px-4 font-sans text-base text-ink shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus-visible:border-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/20 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Input as t };
