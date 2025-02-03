const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-screen w-full overflow-hidden p-2">{children}</div>;
};

export default RootLayout;
