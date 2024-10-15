export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <div>mai hu auth banner</div> */}
        {children}
      </body>
    </html>
  );
}
