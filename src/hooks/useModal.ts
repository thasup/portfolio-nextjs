"use client";

import { useContext } from "react";
import { ModalContext } from "@/components/modal/ModalContext";

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
