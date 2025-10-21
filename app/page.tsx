'use client';

import { useEffect } from "react";
import { CtaBanner } from "./components/homeComponents/cta-banner";
import { Features } from "./components/homeComponents/features";
import { Footer } from "./components/homeComponents/footer";
import { Gallery } from "./components/homeComponents/gallery";
import { Hero } from "./components/homeComponents/hero";
import { Navbar } from "./components/homeComponents/navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
 const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  if (isLoaded && user) return null;

  return (
    <>
      <Navbar />
      <Hero />
      <Gallery />
      <Features />
      <CtaBanner />
      <Footer />
    </>
  );
};

export default Page;
