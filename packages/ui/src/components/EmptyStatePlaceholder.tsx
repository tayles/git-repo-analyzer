interface EmptyStatePlaceholderProps {
  children: React.ReactNode;
}

export function EmptyStatePlaceholder({ children }: EmptyStatePlaceholderProps) {
  return <div className="flex flex-col items-center justify-center gap-4 py-16">{children}</div>;
}
