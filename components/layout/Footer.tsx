import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative text-[#d6d1c9] pt-20 pb-10 overflow-hidden">

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c1a18] to-[#12110f]" />

      {/* SUBTLE TOP GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#01696f]/10 blur-3xl opacity-40" />

      <div className="relative max-w-[1120px] mx-auto px-4">

        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#01696f] to-[#6aa6a3] flex items-center justify-center text-white font-semibold shadow-lg">
                M
              </div>

              <div>
                <div className="font-semibold text-white">Guroos</div>
                <div className="text-xs text-[#9f9a92]">
                  Read. Listen. Watch. Ask
                </div>
              </div>
            </div>

            <p className="text-sm text-[#b8b2a8] leading-relaxed max-w-xs">
              Connecting users with experts for meaningful conversations and deeper understanding.
            </p>
          </div>

          {/* COLUMN */}
          {[
            {
              title: "Learn",
              links: [
                { label: "Find Expert", href: "/search" },
                { label: "Sign Up", href: "/auth/user/register" },
                { label: "Blog", href: "/blogs" },
              ],
            },
            {
              title: "Work",
              links: [
                { label: "Careers", href: "/careers-at-author" },
                { label: "Become Expert", href: "/auth/author/register" },
                { label: "Request Expert", href: "/emailtutor" },
                { label: "Support", href: "/support" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <h3 className="text-white font-semibold mb-5 tracking-tight">
                {col.title}
              </h3>

              <ul className="space-y-3">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#b8b2a8] hover:text-white transition-all duration-200 hover:translate-x-[2px] inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* DIVIDER */}
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-[#2c2b29] to-transparent" />

        {/* BOTTOM */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#9f9a92] gap-3">

          <div>© {new Date().getFullYear()} Guroos</div>

          <div className="text-center md:text-right">
            Private video conversations with trusted experts.
          </div>

        </div>

      </div>
    </footer>
  );
}