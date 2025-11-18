import { useEffect, useState } from "react";

export function useLojaAberta(loja: any) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getMinutes = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const openTime = loja.horarioAbertura
    ? getMinutes(loja.horarioAbertura)
    : 0;

  let closeTime = loja.horarioFechamento
    ? getMinutes(loja.horarioFechamento)
    : 1440;

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const is24h = loja.horarioAbertura === "00:00" && loja.horarioFechamento === "00:00";

  if (closeTime < openTime) closeTime += 1440;

  const isOpen = is24h || (nowMinutes >= openTime && nowMinutes <= closeTime);
  const minutesToClose = isOpen ? closeTime - nowMinutes : 0;

  const closeSoon = isOpen && minutesToClose <= 60;

  const modalType = is24h ? "open-24h" : closeSoon ? "close-soon" : null;
  const shouldShowModal = modalType !== null;

  return {
    isOpen,
    is24h,
    closeSoon,
    minutesToClose,
    shouldShowModal,
    modalType
  };
}
