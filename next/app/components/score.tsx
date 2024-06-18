"use client";

import { usePathname } from "next/navigation";

const Score = () => {
  const pathname = usePathname();
  const scoreId = pathname.split("/")[3];
  return (
    <div>
      <h2>Score {scoreId}</h2>
      <p>Work in progress...</p>
    </div>
  );
};

export default Score;
