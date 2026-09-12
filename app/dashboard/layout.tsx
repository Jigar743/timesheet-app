// app/dashboard/layout.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}