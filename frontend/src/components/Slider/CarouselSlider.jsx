import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./CarouselSlider.css";
import ProfessorCard from "./ProfessorCard"; // Added import
import NoticeBoard from "./NoticeBoard"; // Added import

// Import your images
import i001 from "/img1.jpg";
import i002 from "/img2.jpg";
import i003 from "/img3.jpg";
import i004 from "/img4.jpg";
import i005 from "/Img5.jpg";
import i006 from "/Img6.jpg";

const images = [
  { src: i001, alt: "Image 1" },
  { src: i002, alt: "Image 2" },
  { src: i003, alt: "Image 3" },
  { src: i004, alt: "Image 4" },
  { src: i005, alt: "Image 5" },
  { src: i006, alt: "Image 6" },
];

// Placeholder data for professors - IMPORTANT: Replace imgSrc with actual image paths
const professors = [
  {
    name: "Prof. Alok Kumar Rai",
    title: "Vice-Chancellor, University of Lucknow",
    imgSrc: "/placeholder-vc.jpg",
    profileLink: "#",
    messageLink: "#",
  },
  {
    name: "Prof. Anoop Kumar Singh",
    title: "Chief Provost, University of Lucknow",
    imgSrc: "/placeholder-chiefProvost.jpg",
    profileLink: "#",
    messageLink: "#",
  },
];

const CarouselSlider = () => {
  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="mx-auto px-2 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Professor Cards */}
          <div className="w-full lg:w-2/12 flex flex-col space-y-6">
            {professors.map((prof) => (
              <ProfessorCard
                key={prof.name}
                name={prof.name}
                title={prof.title}
                imgSrc={prof.imgSrc}
                profileLink={prof.profileLink}
                messageLink={prof.messageLink}
              />
            ))}
          </div>

          {/* Center Column: Swiper */}
          <div className="w-full lg:w-8/12">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="rounded-lg shadow-xl h-[550px]"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Column: Notice Board */}
          <div className="w-full lg:w-2/12">
            <NoticeBoard />
          </div>
        </div>
      </div>

      {/* Marquee Section (Welcome Text) - Kept below the 3-column layout */}
      <div className="mt-8 bg-gray-100 text-white py-4 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">
          Welcome to the Hostel Management System
        </h1>
        <p className="text-lg max-w-full mx-auto text-gray-800">
          The official platform for managing hostel accommodations, facilities,
          and services at the University of Lucknow. Explore our hostels, access
          online services, and stay updated with the latest information.
        </p>
      </div>
    </div>
  );
};

export default CarouselSlider;
