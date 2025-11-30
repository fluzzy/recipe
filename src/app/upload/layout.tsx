export default function UploadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='px-4 py-4'>
      <div className='py-4'>Upload</div>
      {children}
    </div>
  );
}
