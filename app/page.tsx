'use client';

import { CtaBanner } from "./components/homeComponents/cta-banner";
import { Features } from "./components/homeComponents/features";
import { Footer } from "./components/homeComponents/footer";
import { Gallery } from "./components/homeComponents/gallery";
import { Hero } from "./components/homeComponents/hero";
import { Navbar } from "./components/homeComponents/navbar";

const Page = () => {


  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <CtaBanner />
      <Footer />
    </>
  );
};

export default Page;
