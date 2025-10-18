"use client";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/general/Toast";
import { AlertProvider } from "../context/alertContext";
import "../styles/globals.css";
import { useContext, useEffect, useState } from "react";
import { AuthProvider } from "../context/AuthContext";

function AppContent({ Component, pageProps }) {
  return (
    <>
      <Toast />
      <Component {...pageProps} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AlertProvider>
      <AuthProvider>
          <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </AlertProvider>
  );
}

export default MyApp;
