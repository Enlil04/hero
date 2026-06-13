import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/gray-images/d564dfc5-1efe-4b96-9887-0fbaabee96a4.png";

const LEFT_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Trainers", href: "#trainers" },
  { label: "Classes", href: "#classes" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#1A1A1C]/75 transition-[color,letter-spacing] duration-300 hover:text-[#942221] hover:tracking-[0.22em] md:text-[0.65rem] md:tracking-[0.2em] md:hover:tracking-[0.26em]"
    >
      {label}
      <span className="absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#942221] transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

function IconLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof UserPlusIcon;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1C]/70 transition-transform duration-300 ease-out hover:scale-110 active:scale-95 md:h-10 md:w-10"
    >
      <span className="absolute inset-0 scale-75 rounded-full bg-[#942221]/0 transition-all duration-300 group-hover:scale-100 group-hover:bg-[#942221]/12" />
      <Icon className="relative z-10 h-[1.15rem] w-[1.15rem] transition-all duration-300 group-hover:rotate-3 group-hover:text-[#942221] md:h-5 md:w-5" />
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="relative z-40 shrink-0 bg-[#DADADA]">
      <div className="relative flex items-center px-[clamp(1.25rem,4vw,3rem)] py-[clamp(0.85rem,2vh,1.25rem)]">
        <nav
          className="hidden items-center gap-[clamp(1rem,2.5vw,2rem)] md:flex"
          aria-label="Primary"
        >
          {LEFT_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="w-10 md:hidden" aria-hidden />

        <Link
          href="/"
          className="group absolute left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out hover:scale-[1.05] active:scale-[0.98]"
          aria-label="Spark Gym home"
        >
          <Image
            src={LOGO_SRC}
            alt="Spark Gym"
            width={400}
            height={100}
            priority
            unoptimized
            className="h-[clamp(1.75rem,4vw,2.25rem)] w-auto select-none transition-[filter,opacity] duration-300 group-hover:brightness-110"
          />
        </Link>

        <div className="ml-auto flex items-center gap-[clamp(0.75rem,2vw,1.25rem)]">
          <IconLink href="#signup" label="Create account" icon={UserPlusIcon} />
          <IconLink href="#contact" label="Contact us" icon={ContactIcon} />
        </div>
      </div>

      <nav
        className="flex items-center justify-center gap-6 border-t border-[#1A1A1C]/[0.06] py-2 md:hidden"
        aria-label="Primary mobile"
      >
        {LEFT_LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>
    </header>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
