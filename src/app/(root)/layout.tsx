const RootLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="px-2">
      {children}
    </div>
  )
}

export default RootLayout;