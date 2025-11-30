export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='m-auto flex min-h-svh max-w-sm flex-col justify-center gap-6'>
      {children}
    </div>
  );
}
