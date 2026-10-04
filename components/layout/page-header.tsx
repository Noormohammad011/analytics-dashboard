type PageHeaderProps = {
  title: string
  description?: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </header>
  )
}
