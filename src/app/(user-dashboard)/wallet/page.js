import React, { Suspense } from "react";
import Wallet from "@/rendering/wallet";

export default function page() {
  return (
    <Suspense>
      <Wallet />
    </Suspense>
  );
}
