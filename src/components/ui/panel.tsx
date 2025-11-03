import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const panelVariants = cva(
  "transition-all duration-300 ease-in-out bg-zinc-900 border-zinc-800",
  {
    variants: {
      position: {
        top: "fixed top-0 left-0 right-0 border-b z-40",
        left: "fixed left-0 top-0 bottom-0 border-r z-30",
        right: "fixed right-0 top-0 bottom-0 border-l z-30",
        bottom: "fixed bottom-0 left-0 right-0 border-t z-40",
      },
      overlay: {
        true: "shadow-2xl",
        false: "",
      },
      open: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        position: "left",
        open: false,
        className: "-translate-x-full",
      },
      {
        position: "left",
        open: true,
        className: "translate-x-0",
      },
      {
        position: "right",
        open: false,
        className: "translate-x-full",
      },
      {
        position: "right",
        open: true,
        className: "translate-x-0",
      },
      {
        position: "top",
        open: false,
        className: "-translate-y-full",
      },
      {
        position: "top",
        open: true,
        className: "translate-y-0",
      },
      {
        position: "bottom",
        open: false,
        className: "translate-y-full",
      },
      {
        position: "bottom",
        open: true,
        className: "translate-y-0",
      },
    ],
    defaultVariants: {
      position: "left",
      overlay: true,
      open: false,
    },
  }
);

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  open?: boolean;
  width?: string | number;
  height?: string | number;
  pinned?: boolean;
  onToggle?: () => void;
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      position,
      overlay,
      open = false,
      width,
      height,
      pinned = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const getSize = () => {
      const sizeStyle: React.CSSProperties = {};

      if (position === "left" || position === "right") {
        if (width) {
          sizeStyle.width = typeof width === "number" ? `${width}px` : width;
        }
      }

      if (position === "top" || position === "bottom") {
        if (height) {
          sizeStyle.height = typeof height === "number" ? `${height}px` : height;
        }
      }

      return sizeStyle;
    };

    return (
      <div
        ref={ref}
        data-slot="panel"
        data-position={position}
        data-pinned={pinned}
        data-open={open}
        className={cn(panelVariants({ position, overlay, open }), className)}
        style={{ ...getSize(), ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = "Panel";

const PanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="panel-header"
    className={cn(
      "flex items-center justify-between border-b border-zinc-800 px-4 py-3",
      className
    )}
    {...props}
  />
));
PanelHeader.displayName = "PanelHeader";

const PanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="panel-title"
    className={cn("text-sm font-semibold text-zinc-50", className)}
    {...props}
  />
));
PanelTitle.displayName = "PanelTitle";

const PanelContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="panel-content"
    className={cn("overflow-auto p-4", className)}
    {...props}
  />
));
PanelContent.displayName = "PanelContent";

const PanelFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="panel-footer"
    className={cn(
      "flex items-center border-t border-zinc-800 px-4 py-3",
      className
    )}
    {...props}
  />
));
PanelFooter.displayName = "PanelFooter";

export { Panel, PanelHeader, PanelTitle, PanelContent, PanelFooter, panelVariants };
