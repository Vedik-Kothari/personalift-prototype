import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary px-5 py-3 text-white hover:bg-blue-600",
        secondary: "bg-white px-5 py-3 text-slate-900 hover:bg-slate-100",
        ghost: "bg-slate-100 px-5 py-3 text-slate-900 hover:bg-slate-200",
        danger: "bg-danger px-5 py-3 text-white hover:bg-rose-600",
        warning: "bg-accent px-5 py-3 text-slate-950 hover:bg-orange-400"
      },
      size: {
        default: "",
        sm: "px-3 py-2 text-xs"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
