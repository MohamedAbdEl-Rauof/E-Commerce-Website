import React, { useEffect, useState } from "react";

interface Image {
  url: string;
  alt?: string;
}

const SliderImage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/SliderSection");
        const data = await response.json();
        setImages(data[0]?.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  // Automatically change image every 9 seconds
  useEffect(() => {
    if (images.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 9000);
      return () => clearInterval(intervalId);
    }
  }, [images]);

  const containerWidth = "100%";
  const containerHeight = "h-[350px] sm:h-[450px] lg:h-[550px]";

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="mt-10 w-[90%] mx-auto">
      <div
        className={`relative overflow-hidden ${containerHeight}`}
        style={{
          width: containerWidth,
        }}
      >
        {images.length > 0 && (
          <img
            srcSet={`${images[currentIndex].url}?w=600&h=350&fit=crop 600w, ${images[currentIndex].url}?w=1200&h=700&fit=crop 1200w`}
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Previous button */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition duration-300"
          aria-label="Previous Image"
        >
          &#10094;
        </button>

        {/* Next button */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition duration-300"
          aria-label="Next Image"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default SliderImage;
