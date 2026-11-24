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
        className={`h-11 w-auto max-w-[210px] object-contain object-left sm:h-12 sm:max-w-[240px] md:h-14 md:max-w-[280px] ${
          inverted ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}
