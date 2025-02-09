import { cn } from "@/lib/utils";

// Display
export function Display1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )} 
      {...props} 
    />
  );
}

// Headings
export function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(
        "scroll-m-20 text-3xl font-bold tracking-tight",
        className
      )} 
      {...props} 
    />
  );
}

export function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )} 
      {...props} 
    />
  );
}

export function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )} 
      {...props} 
    />
  );
}

export function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )} 
      {...props} 
    />
  );
}

// Body text
export function P({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className
      )} 
      {...props} 
    />
  );
}

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "text-xl text-muted-foreground",
        className
      )} 
      {...props} 
    />
  );
}

export function Large({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "text-lg font-semibold",
        className
      )} 
      {...props} 
    />
  );
}

export function Small({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <small 
      className={cn(
        "text-sm font-medium leading-none",
        className
      )} 
      {...props} 
    />
  );
}

export function Subtle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "text-sm text-muted-foreground",
        className
      )} 
      {...props} 
    />
  );
}

// Labels
export function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label 
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )} 
      {...props} 
    />
  );
}

// Code
export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code 
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )} 
      {...props} 
    />
  );
}

// Lists
export function List({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul 
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2",
        className
      )} 
      {...props} 
    />
  );
}

export function ListItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li 
      className={cn(
        "mt-2",
        className
      )} 
      {...props} 
    />
  );
}

// Blockquote
export function Blockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote 
      className={cn(
        "mt-6 border-l-2 border-primary pl-6 italic",
        className
      )} 
      {...props} 
    />
  );
}