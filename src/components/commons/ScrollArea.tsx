interface ScrollAreaProps {
  children: React.ReactNode;
}

export function ScrollArea({ children }: ScrollAreaProps) {
  return <div className="flex-1">{children}</div>;
}
