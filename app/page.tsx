import Scene3DWrapper from "@/components/Scene3DWrapper";
import Hero from "@/components/Hero";
import Product from "@/components/Product";
import Team from "@/components/Team";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import ScrollProvider from "@/components/ScrollProvider";
import FullscreenLock from "@/components/FullscreenLock";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      {/* 3D Canvas — fixed background layer */}
      <Scene3DWrapper />

      <FullscreenLock>
        {/* Diagnostics preloader */}
        <Preloader />

        {/* UI Overlay — sits above the 3D canvas */}
        <ScrollProvider>
          <main className="relative z-10 pointer-events-none">
            <Hero />
            <Product />
            <Team />
            <Contacts />
            <Footer />
          </main>
        </ScrollProvider>
      </FullscreenLock>
    </>
  );
}
