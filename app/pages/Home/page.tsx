"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header/page";
import Footer from "../../components/Footer/page";
import Newsletter from "../../components/Newsletter/page";
import SliderImage from "./components/SliderImage";
import Categories from "./components/Categories";
import NewArrivalsProduct from "./components/NewArrivalsProduct";
import BannerSection from "@/app/pages/Home/components/BannerSection";
import ValuesSection from "@/app/pages/Home/components/ValuesSection";
import TextSection from "@/app/pages/Home/components/TextSection";
import Loading from "../../components/Loading/page";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <>
          {/* Header Section*/}
          <div>
            <Header />
          </div>

          {/* Slider Section */}
          <div>
            <SliderImage />
          </div>

          {/* Text Section */}
          <div>
            <TextSection />
          </div>

          {/* Categories Section */}
          <div>
            <Categories />
          </div>

          {/* New Arrivals Section */}
          <div>
            <NewArrivalsProduct />
          </div>

          {/* Values Section */}
          <div>
            <ValuesSection />
          </div>

          {/* Banner Section */}
          <div>
            <BannerSection />
          </div>

          {/* Newsletter */}
          <Newsletter />

          {/* Footer Section */}
          <div className="w-full">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
