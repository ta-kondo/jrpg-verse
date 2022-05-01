type LayoutProps = Required<{
  readonly children: JSX.Element;
}>;

export const SiteLayout = ({ children }: LayoutProps) => (
  <>
    {/* <Header /> */}
    {children}
    {/* <Footer /> */}
  </>
);
