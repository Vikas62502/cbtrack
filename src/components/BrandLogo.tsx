import Image from "next/image";
import Link from "next/link";

type Props = {
  className?: string;
  inverted?: boolean;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  inverted = false,
  priority = false,
}: Props) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="CB Trackel home"
    >
      <Image
        src="/cb-trackel-logo.png"
        alt="CB Trackel"
        width={508}
        height={170}
        priority={priority}
        className={`h-14 w-auto max-w-[240px] object-contain object-left sm:h-16 sm:max-w-[300px] md:h-[4.5rem] md:max-w-[360px] ${
          inverted ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}
