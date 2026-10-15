import KeystaticApp from "./keystatic/keystatic";

export const metadata = { title: "Content editor", robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
