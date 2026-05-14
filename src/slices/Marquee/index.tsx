import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import { LogoMark } from "@/app/components/LogoMark";

/**
 * Props for `Marquee`.
 */
export type MarqueeProps = SliceComponentProps<Content.MarqueeSlice>;

/**
 * Tách component ra ngoài để tránh lỗi:
 * Cannot create components during render
 */
type MarqueeContentProps = {
  phrases: Content.MarqueeSlice["primary"]["phrases"];
};
const MarqueeContent: FC<MarqueeContentProps> = ({ phrases }) => (
  <div className="flex items-center bg-gray-200 py-10 whitespace-nowrap">
    {phrases.map((item, i) => (
      <Fragment key={i}>
        <div className="font-bold-slanted px-14 text-[180px] leading-none text-gray-400/80 uppercase [text-box:trim-both_cap_alphabetic] md:text-[260px]">
          {item.text}
        </div>

        <LogoMark className="size-36 flex-shrink-0" />
      </Fragment>
    ))}
  </div>
);

/**
 * Component for "Marquee" Slices.
 */
const Marquee: FC<MarqueeProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div
        className="relative flex w-full items-center overflow-hidden select-none"
        aria-hidden="true"
        role="presentation"
      >
        <div
          className={clsx(
            "marquee-track animate-marquee flex items-center whitespace-nowrap",
            slice.primary.direction === "Right" &&
              "[animation-direction:reverse]",
          )}
        >
          {/* duplicate content để marquee chạy vô hạn */}
          <MarqueeContent phrases={slice.primary.phrases} />
          <MarqueeContent phrases={slice.primary.phrases} />
          <MarqueeContent phrases={slice.primary.phrases} />
        </div>
      </div>
    </section>
  );
};

export default Marquee;
