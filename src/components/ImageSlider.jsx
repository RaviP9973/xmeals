import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// import "./styles.css";

// import required modules
import { Autoplay, Pagination, Navigation, FreeMode } from "swiper/modules";
import ImageModal from "./ImageModal";

export default function ImageSlider({ images }) {
  return (
    <>
      {images?.length !== 0 ? (
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          //   navigation={true}
          modules={[Autoplay, Pagination, FreeMode]}
          className="mySwiper w-32 h-32"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}

                className="w-32 h-32 cursor-pointer object-cover rounded-lg shadow-md transition duration-300"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No image found</p>
      )}
    </>
  );
}
