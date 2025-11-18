"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./styles/Desktop.module.css"; // Assumindo que o styles.module.css está no mesmo nível ou que o caminho é ajustado

export default function Carousel({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Image
        src="/images/placeholder.jpg" // Placeholder se não houver imagens
        alt={altText}
        width={500}
        height={500}
        style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
      />
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className={styles["carousel-container"]} style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}>
      <Image
        src={images[currentIndex]}
        alt={`${altText} - Imagem ${currentIndex + 1}`}
        width={500}
        height={500}
        style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={styles["carousel-button"]}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className={styles["carousel-button"]}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            &#10095;
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className={styles["carousel-dots"]} style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center", zIndex: 10 }}>
          {images.map((_, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                margin: "0 4px",
                borderRadius: "50%",
                backgroundColor: index === currentIndex ? "#a72901" : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
              }}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
