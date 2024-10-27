"use client"
import { useState, useEffect } from "react";

function RotatingHomePage() {
  const [homepages, setHomepages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch all homepages from the API
  useEffect(() => {
    const fetchHomepages = async () => {
      const response = await fetch("/api/homepage");
      const data = await response.json();
      setHomepages(data.data);
    };
    fetchHomepages();
  }, []);

  // Rotate homepage every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % homepages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [homepages.length]);

  if (homepages.length === 0) return <p>Loading...</p>;

  // Render current homepage
  const homepage = homepages[currentPage];
  return (
    <div>
      <div className="top-section">
        <img src={homepage.top.image} alt="Top section" />
      </div>
      <div className="middle-section">
        {homepage.middle.images.map((img, idx) => (
          <img key={idx} src={img} alt={`Middle ${idx}`} />
        ))}
      </div>
      <div className="last-section">
        {homepage.last.categories.map((cat, idx) => (
          <div key={idx}>
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RotatingHomePage;
