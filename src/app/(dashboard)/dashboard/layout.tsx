import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ravi Basrur Shows Admin",
  description: "Ravi Basrur Shows Admin",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.getUser();

  // console.log(data, error);
  if (error || !data?.user) {
    redirect("/");
  }
  return (
    <>
      <Header />
      <div className="flex flex-row h-screen  w-screen">
        <Sidebar />

        <main className="w-full pt-16 flex-grow  overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
