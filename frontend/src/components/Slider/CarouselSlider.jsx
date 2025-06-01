import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./index.css"

// Import your images
import i001 from "/Img1.jpg";
import i002 from "/Img2.jpg";
import i003 from "/Img3.jpg";
import i004 from "/Img4.jpg";
import i005 from "/Img5.jpg";
import i006 from "/Img6.jpg";
// ... import the rest of your images

const images = [
  { src: i001, alt: "Image 1" },
  { src: i002, alt: "Image 2" },
  { src: i003, alt: "Image 3" },
  { src: i004, alt: "Image 4" },
  { src: i005, alt: "Image 5" },
  { src: i006, alt: "Image 6" },
 
];

const CarouselSlider = () => {
  return (
    <div className="w-full relative">
      
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full object-fit h-[800px] sm:h-[500px] lg:h-[800px] transition-all duration-700 rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Marquee Section */}
      <div className="bg-black p-4">
        <div className="flex flex-col justify-center items-center">
          <p className="md:text-3xl text-[15px] font-extrabold text-white text-center">
             Hostel Management System
          </p>
          <p className="text-white md:text-4xl text-xl font-bold">
            University of Lucknow
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarouselSlider;
