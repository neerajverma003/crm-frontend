import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskAssign from "./TaskAssign";
import TaskReport from "./TaskReport";

const MainTaskManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskAssign />} />
      <Route path="/assign" element={<TaskAssign />} />
      <Route path="/report" element={<TaskReport />} />
    </Routes>
  );
};

export default MainTaskManagement;
