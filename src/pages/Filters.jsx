import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Filters = ({ handleUser, user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await handleUser("signout-request");
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <h1>Filters</h1>
      <div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Filters;
