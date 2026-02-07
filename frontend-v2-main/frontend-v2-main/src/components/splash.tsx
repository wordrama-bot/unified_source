"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import anime from "animejs";
import { useAuth } from "@/providers/auth-provider";

const SplashScreen = ({ finishLoading }: any) => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 1.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 1.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 10,
        duration: 500,
        easing: "easeInOutExpo",
      });
  }

  useEffect(() => {
    if (user) return finishLoading();
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, [user])

  return (
    <div
      className="flex h-screen items-center justify-center"
    >
      <Image
        id="logo"
        src="https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr"
        alt="Wordrama Logo"
        width={200}
        height={200}
      />
    </div>
  )
}

export default SplashScreen
