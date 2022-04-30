import { ReactElement } from "react";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const SiteLayout = ({ children }: LayoutProps) => (
  <>
    {/* <Header /> */}
    {children}
    {/* <Footer /> */}
  </>
);
