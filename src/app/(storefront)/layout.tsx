import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#15263f,transparent_26%),linear-gradient(180deg,#07111f_0%,#0c1628_48%,#07111f_100%)]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
