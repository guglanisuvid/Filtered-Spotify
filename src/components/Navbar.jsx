import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleUser, userName }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="w-full h-[48px] flex justify-center items-center px-4">
      <div className="w-full flex gap-4 justify-between items-center py-1">
        <h2 className="text-xl font-semibold">Filtered Spotify</h2>
        <div className="flex gap-2 justify-between items-center">
          <button
            onClick={() => setToggleMenu(!toggleMenu)}
            className="text-xl font-semibold flex gap-2 justify-between items-baseline outline-none z-10 hover:cursor-pointer"
          >
            <span className="text-xl font-semibold">{userName}</span>
            <span className="text-lg">
              <FontAwesomeIcon icon={faArrowDown} />
            </span>
          </button>
          <div
            className={`absolute aspect-video bg-bg-200 p-4 origin-top-right transition duration-400 top-12 right-4 ease-in-out ${
              toggleMenu ? "scale-100 opacity-100" : "scale-0 opacity-0"
            } rounded-2xl`}
          >
            <div className="flex flex-col gap-8 justify-between items-center">
              <Link
                to={"/dashboard"}
                onClick={() => setToggleMenu(false)}
                className="text-[16px] font-medium hover:cursor-pointer"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setToggleMenu(false);
                  handleUser("signout-request");
                }}
                className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
              >
                Signout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
