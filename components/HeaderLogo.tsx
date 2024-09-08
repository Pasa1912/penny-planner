import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => (
  <Link href="/">
    <div className="hidden lg:flex items-center">
      <Image
        src="/pennyPlanner.svg"
        alt="PennyPlanner"
        height={28}
        width={28}
      />
      <p className="font-semibold text-white text-2xl ml-2.5">PennyPlanner</p>
    </div>
  </Link>
);
