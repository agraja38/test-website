import Link from "next/link";
import { Search, ShoppingCart, Heart, UserRound, Headset } from "lucide-react";
import { getSession } from "@/lib/auth/session";

const hotKeywords = [
  "smart watch",
  "travel bag",
  "home decor",
  "wireless router",
  "supplements",
  "desk lamp",
];

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/95 backdrop-blur">
      <div className="border-b border-white/6 bg-[#0a1529]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-400 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span>Sri Lanka</span>
            {!session ? (
              <>
                <Link href="/login" className="text-[#ff8e3c] hover:text-white">Hi, please sign in</Link>
                <Link href="/register" className="hover:text-white">Free register</Link>
              </>
            ) : (
              <span className="text-slate-300">Welcome back, {session.firstName}</span>
            )}
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/account/orders" className="hover:text-white">My Orders</Link>
            <Link href="/account" className="hover:text-white">My Account</Link>
            <Link href="/cart" className="hover:text-white">Cart</Link>
            <Link href="/contact" className="hover:text-white">Help Center</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4 lg:w-[180px]">
            <Link href="/" className="leading-none">
              <span className="block text-[3rem] font-semibold tracking-tight text-[#ff6a00]">Luxe</span>
              <span className="-mt-1 block text-[2rem] font-semibold tracking-tight text-[#ff9a3d]">Cart</span>
            </Link>
          </div>

          <div className="flex-1">
            <form action="/shop" className="flex items-center gap-3">
              <div className="flex flex-1 items-center overflow-hidden rounded-full border-2 border-[#ff6a00] bg-white">
                <select
                  name="category"
                  defaultValue=""
                  className="h-12 border-r border-slate-200 bg-transparent px-4 text-sm text-slate-700 outline-none"
                >
                  <option value="">All</option>
                  <option value="signature-living">Living</option>
                  <option value="wellness-essentials">Wellness</option>
                  <option value="travel-ready">Travel</option>
                </select>
                <input
                  name="search"
                  placeholder="Search products, categories, and daily deals"
                  className="h-12 flex-1 px-4 text-sm text-slate-900 outline-none"
                />
                <button
                  type="submit"
                  className="flex h-12 items-center gap-2 bg-[#ff6a00] px-6 text-sm font-semibold text-white"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
              {hotKeywords.map((keyword) => (
                <Link key={keyword} href={`/shop?search=${encodeURIComponent(keyword)}`} className="hover:text-white">
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {[
              { href: "/account", icon: UserRound, label: "Account" },
              { href: "/cart", icon: ShoppingCart, label: "Cart" },
              { href: "/account/orders", icon: Heart, label: "Saved" },
              { href: "/contact", icon: Headset, label: "Support" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
