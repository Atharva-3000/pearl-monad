import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";
import Image from "next/image";
import nillion from "../../public/nillion.svg";
import wormhole from "../../public/wormhole.svg";
import monad from "../../public/monad.svg";
import xblack from "../../public/Powered by 0x - Black.png"
import privy from "../../public/privy.png"
import envio from "../../public/envio.png"
const logos = [
  {
    img: nillion.src,
  },
  {
    img: wormhole.src,
  },
  {
    img: monad.src,
  },
  {
    img:xblack,
  },
  {
    img:privy,
  },
  {
    img:envio,
  }
];

const LogoCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        "relative w-80 h-40 cursor-pointer overflow-hidden rounded-xl border p-6",
        "border-gray-950/[.2] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] bg-monad-offwhite/60 transition-all duration-200"
      )}
    >
      <div className="flex items-center justify-center h-full w-full">
        <Image
          className="object-contain max-w-full max-h-full"
          width={160}
          height={80}
          alt="Logo"
          src={img}
        />
      </div>
    </figure>
  );
};

export function MarqueeDemoVertical() {
  return (
    <div className="relative flex h-[600px] w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover reverse vertical className="[--duration:14s]">
        {logos.map((logo, index) => (
          <LogoCard key={index} {...logo} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
