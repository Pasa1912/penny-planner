import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children?: JSX.Element;
}) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
}
