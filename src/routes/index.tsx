import { createFileRoute } from "@tanstack/react-router";
import Hero from "../components/Hero";
import Products from "../components/Products";
import PromoSection from "../components/PromoSection";
import DiarySection from "../components/DiarySection";
import Footer from "../components/Footer";
export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="h-full min-h-svh  bg-[#140d0A]">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 text-[#F5F1EB] md:px-6">
        <Hero></Hero>
        <Products></Products>
        <PromoSection></PromoSection>
        <DiarySection></DiarySection>
        <Footer></Footer>
      </div>
    </div>
  );
}
