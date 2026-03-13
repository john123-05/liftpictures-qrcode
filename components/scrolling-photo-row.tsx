import type { CSSProperties } from "react";
import { PhotoCard } from "@/components/photo-card";
import type { GalleryPhoto } from "@/types/photo";

type ScrollingPhotoRowProps = {
  photos: GalleryPhoto[];
  direction?: "left" | "right";
};

export function ScrollingPhotoRow({
  photos,
  direction = "left",
}: ScrollingPhotoRowProps) {
  if (photos.length === 1) {
    return (
      <div className="flex justify-center py-2 sm:py-4">
        <PhotoCard photo={photos[0]} eager />
      </div>
    );
  }

  const durationInSeconds = Math.max(280, photos.length * 22);
  const animationStyle = {
    "--scroll-duration": `${durationInSeconds}s`,
    animationDirection: direction === "right" ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div className="w-full overflow-hidden py-0.5 sm:py-1">
      <div className="gallery-track flex w-max" style={animationStyle}>
        <div className="flex gap-6 pl-0.5 pr-6 sm:gap-8 sm:pl-1 sm:pr-8 lg:pl-2">
          {photos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} eager={index < 2} />
          ))}
        </div>

        <div className="flex gap-6 pr-6 sm:gap-8 sm:pr-8" aria-hidden="true">
          {photos.map((photo) => (
            <PhotoCard key={`${photo.id}-duplicate`} photo={photo} />
          ))}
        </div>
      </div>
    </div>
  );
}
