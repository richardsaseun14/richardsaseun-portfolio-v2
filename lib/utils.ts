// shadcn components import `cn` from the "cn" package directly; re-exported here for app code.
export { cn } from "cn";

/** True when `href` is the current route or one of its children. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
