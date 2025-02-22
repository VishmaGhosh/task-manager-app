import FeaturedCourses from "@/components/FeaturedCourses";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Instructors from "@/components/Instructor";


export default function Home() {
  
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.05] app-page-main-body">
      <HeroSection />
      <FeaturedCourses />
      <Instructors />
      <Footer />
   </main>
  );
}