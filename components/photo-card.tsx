import { QrBadge } from "@/components/qr-badge";
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
      <div className="aspect-[16/10.8] overflow-hidden border border-black/5 bg-[#fafaf8]">
        <img
          src={photo.resolvedImageUrl}
          alt={`Galeriebild ${shortId(photo.id)}`}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.015]"
        />
      </div>
      <QrBadge photo={photo} />
    </article>
  );
}
