"use client";
import { useEffect, useRef, useState } from "react";

export function useCarousel(scrollSpeed = 200, intervalTime = 2500) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ===== AUTOPLAY =====
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollStep = () => {
      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: scrollSpeed, behavior: "smooth" });
      }
    };

    const interval = setInterval(scrollStep, intervalTime);
    return () => clearInterval(interval);
  }, [scrollSpeed, intervalTime]);

  // ===== ARRASTAR COM O MOUSE =====
  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;
    setIsDragging(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!isDragging || !slider) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
  };

  return {
    sliderRef,
    isDragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  };
}

// import { useRef, useState, useCallback } from 'react';



// export function useCarousel() {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     if (!sliderRef.current) return;
    
//     setIsDragging(true);
//     setStartX(e.pageX - sliderRef.current.offsetLeft);
//     setScrollLeft(sliderRef.current.scrollLeft);
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   const handleMouseMove = useCallback((e: React.MouseEvent) => {
//     if (!isDragging || !sliderRef.current) return;

//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX) * 1; // Multiplicador de velocidade
//     sliderRef.current.scrollLeft = scrollLeft - walk;
//   }, [isDragging, startX, scrollLeft]);

//   return {
//     sliderRef,
//     isDragging,
//     handleMouseDown,
//     handleMouseLeave,
//     handleMouseUp,
//     handleMouseMove,
//   };
// }
