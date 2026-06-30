export const metadata = {
  title: 'Get in touch',
  robots: { index: false, follow: false },
};

export default function GetInTouchPage() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
      <a
        href="tel:+38163457732"
        className="font-serif italic text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground hover:text-primary transition-colors duration-300"
      >
        +381 63 457 732
      </a>
      <a
        href="https://calendar.proton.me/bookings#JYMREMLCjyvtswEjAYGH0JVpazFizVa_Jzio68EOjfQ="
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 text-base md:text-lg text-muted-foreground underline underline-offset-4 hover:text-primary transition-colors duration-300"
      >
        book a call
      </a>
    </div>
  );
}
