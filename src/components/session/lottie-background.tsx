
'use client';

import Lottie from "lottie-react";
import animationDataJson from "@/lib/lottie/background.json";

export function LottieBackground() {
  // The 'any' type is used here to bypass a TypeScript type mismatch with the Lottie library's expected format.
  const animationData: any = animationDataJson;

  return (
    <div className="absolute inset-0 -z-10">
        <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    </div>
  );
}
