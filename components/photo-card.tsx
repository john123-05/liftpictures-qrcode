import Image from "next/image";
import { QrBadge } from "@/components/qr-badge";
import liftpicturesLogo from "@/assets/Liftpicutures Logo alt.jpg";
import type { GalleryPhoto } from "@/types/photo";

type PhotoCardProps = {
  photo: GalleryPhoto;
  eager?: boolean;
};

function shortId(value: string) {
  if (value.length <= 10) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function PhotoCard({ photo, eager = false }: PhotoCardProps) {
  return (
    <article className="group grid w-[28rem] shrink-0 grid-cols-[minmax(0,1fr)_5.8rem] gap-3 border border-line bg-white p-3 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.18)] sm:w-[34rem] sm:grid-cols-[minmax(0,1fr)_6.3rem] sm:gap-4 sm:p-4 xl:w-[39rem] xl:grid-cols-[minmax(0,1fr)_7rem]">
      <div className="relative aspect-[16/10.8] overflow-hidden border border-black/5 bg-[#fafaf8]">
        <img
          src={photo.resolvedImageUrl}
          alt={`Galeriebild ${shortId(photo.id)}`}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.015]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(128deg,rgba(255,255,255,0.08)_0%,transparent_36%,rgba(255,255,255,0.14)_52%,transparent_72%,rgba(255,255,255,0.08)_100%)]" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[72%] w-[72%] max-h-[15rem] max-w-[15rem] rotate-[-16deg] sm:max-h-[18rem] sm:max-w-[18rem] xl:max-h-[20rem] xl:max-w-[20rem]">
            <Image
              src={liftpicturesLogo}
              alt="LiftPictures Logo"
              fill
              sizes="320px"
              className="object-contain opacity-28 mix-blend-multiply saturate-0 contrast-125"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          <div className="relative h-12 w-12 overflow-hidden border border-white/70 bg-white/36 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.4)] backdrop-blur-[2px] sm:h-14 sm:w-14">
            <Image
              src={liftpicturesLogo}
              alt="LiftPictures Logo"
              fill
              sizes="56px"
              className="object-cover opacity-78 mix-blend-multiply saturate-0"
            />
          </div>
        </div>
      </div>
      <QrBadge photo={photo} />
    </article>
  );
}
