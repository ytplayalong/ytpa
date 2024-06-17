"use client";

import Link from "next/link";
import { handleButtonClick } from "./analytics";

export default function Home() {
  const clickHandler = () => handleButtonClick("click", "button");
  return (
    <div style={{ textAlign: "center" }}>
      <p>Play along YouTube videos.</p>
      <h2>Work in progress, updates will follow...</h2>
      <button onClick={clickHandler}>Button</button>

      <Link href="/help">Help</Link>
    </div>
  );
}
