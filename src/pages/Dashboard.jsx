import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return <div>Dashboard</div>;
};

export default Dashboard;
