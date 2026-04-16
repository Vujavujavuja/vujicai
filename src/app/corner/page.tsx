export const metadata = {
  title: "Vuja's Corner",
  description: "My random top picks and whatever I like / dislike.",
};

export default function CornerPage() {
  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl md:pl-24">
        <div className="mb-16 text-center">
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            welcome to
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Vuja&apos;s Corner
          </h1>
          <p className="text-muted-foreground">
            My random top picks and whatever I like / dislike
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-6 min-h-[200px] bg-card/50">
            <h2 className="font-serif text-2xl font-medium mb-3">Coming soon</h2>
            <p className="text-muted-foreground text-sm">This corner is still being decorated.</p>
          </div>
          <div className="rounded-2xl border border-border p-6 min-h-[200px] bg-card/50">
            <h2 className="font-serif text-2xl font-medium mb-3">Coming soon</h2>
            <p className="text-muted-foreground text-sm">This corner is still being decorated.</p>
          </div>
          <div className="rounded-2xl border border-border p-6 min-h-[200px] bg-card/50">
            <h2 className="font-serif text-2xl font-medium mb-3">Coming soon</h2>
            <p className="text-muted-foreground text-sm">This corner is still being decorated.</p>
          </div>
          <div className="rounded-2xl border border-border p-6 min-h-[200px] bg-card/50">
            <h2 className="font-serif text-2xl font-medium mb-3">Coming soon</h2>
            <p className="text-muted-foreground text-sm">This corner is still being decorated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
