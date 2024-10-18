import React from "react";
import "@/css/app.css";

export default function LandingBackground() {
  return (
    <div className="fixed inset-0 -z-10 flex h-screen w-screen justify-center">
      <div className="radial-background block h-full w-full max-w-4xl opacity-40 blur-[70px] saturate-150 dark:opacity-25 dark:blur-[50px]"></div>
    </div>
  );
}
