import clsx from "clsx";
import React, { ReactNode } from "react";

type BoundedProps = {
  as?: "section" | "footer"; //cho phép đổi tag html thành <footer> or <section>
  fullWidth?: boolean; //true full màn hình|false default(giới hạn 7xl)
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
};
export function Bounded({
  as: Comp = "section",
  fullWidth = false,
  className,
  innerClassName,
  children,
}: BoundedProps) {
  return (
    <Comp
      className={clsx(
        "px-6 py-10 md:py-20 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className,
      )}
    >
      <div
        className={clsx(
          "mx-auto w-full",
          !fullWidth && "max-w-7xl",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Comp>
  );
}
