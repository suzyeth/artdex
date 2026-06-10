"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dex", icon: "🖼️", label: "Dex" },
  { href: "/capture", icon: "📷", label: "Capture" },
  { href: "/map", icon: "🗺️", label: "Map" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/") return null; // landing page has its own CTA

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-amber-400" : "text-zinc-500"
              }`}
            >
              <span className="text-xl leading-none">{t.icon}</span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
