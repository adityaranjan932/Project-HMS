import React from "react";
import LU from "/universitylogo.png";
import Name from "/universityname.png";
import A from "/A++.png";

const TopNavbar = () => {
  return (
    <>
      <div className="md:h-28 w-full flex justify-center sm:justify-between items-center p-2 box-border">
        <img
          src={LU}
          className="h-12 sm:h-16 md:h-15 lg:h-[5.27rem] ml-2 hidden sm:block"
          alt="Logo 1"
        />
        <img
          src={Name}
          className="h-12 sm:h-16 md:h-20 lg:h-20 "
          alt="Logo 2"
        />
        <div className="rounded-[50%] overflow-hidden mr-2 hidden sm:block">
          <img
            src={A}
            className="h-12 sm:h-16 md:h-15 lg:h-20 bg-black "
            alt="Logo 3"
          />
        </div>
      </div>
      <div className="p-2 text-center font-bold text-[10px] lg:text-[1.3rem] text-red-950 bg-gray-300">
        Office of Hostel Management-University of Lucknow
      </div>
    </>
  );
};

export default TopNavbar;
