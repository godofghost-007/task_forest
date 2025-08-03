
'use client';

import Lottie from "lottie-react";
import animationData from "@/lib/lottie/background.json";

export function LottieBackground() {
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
