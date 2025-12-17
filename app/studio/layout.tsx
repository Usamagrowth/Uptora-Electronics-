import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Uptora Electronic Store",
  description: "Best Electronic Store in Ibadan, Nigerial",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default RootLayout;
