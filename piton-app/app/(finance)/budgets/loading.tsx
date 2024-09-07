import React from "react";
import "@/css/loader.css";

export default function loading() {
  return (
    <div
      role="status"
      className="flex min-h-dvh items-center justify-center bg-[#f5f5f5]"
    >
      <span className="loader"></span>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
