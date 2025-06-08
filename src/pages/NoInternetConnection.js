import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const NoInternetConnection = (props) => {
  const [isOnline, setOnline] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOnline(navigator.onLine);
    }
  }, []);

  window.addEventListener("online", () => {
    setOnline(true);
  });

  window.addEventListener("offline", () => {
    setOnline(false);
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (isOnline) {
    return props.children;
  } else {
    return (
      <p className="text-center text-[#8292A1]">
        {t("No internet connection , please check your internet connection")}
      </p>
    );
  }
};

export default NoInternetConnection;
