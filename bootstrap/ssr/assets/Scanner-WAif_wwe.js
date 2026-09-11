import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CKYSMoJT.js";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import "./Dropdown-BgvF6zKd.js";
import "@headlessui/react";
import "./ThemeToggle-BY9dagkZ.js";
import "./TextInput-D0qTZeQv.js";
import "./ProfilePhoto-CJ2Z04pO.js";
import "./Modal-CKHW52Ki.js";
import "./SecondaryButton-TjIrbn1G.js";
import "./lang-COBcTD8W.js";
import "./PrimaryButton-BNNL2gCI.js";
import "./DangerButton-B7to2Tbx.js";
import "./Footer-CDwTxrct.js";
import "./useTheme-CngFDcs1.js";
function Scanner({ auth }) {
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const isProcessingRef = useRef(false);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */
      false
    );
    const playBeep = () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.error("Audio play failed", e);
      }
    };
    const onScanSuccess = async (decodedText, decodedResult) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      playBeep();
      try {
        const response = await axios.post(route("api.admin.attendance.scan"), {
          qr_token: decodedText
        });
        setScanResult({
          status: "success",
          message: response.data.message || "Attendance recorded successfully!",
          data: response.data
        });
        setScanError(null);
        setTimeout(() => {
          isProcessingRef.current = false;
          setScanResult(null);
        }, 3e3);
      } catch (error) {
        console.error("Scan processing error:", error);
        setScanError(error.response?.data?.message || "Invalid QR Code or System Error");
        setScanResult(null);
        setTimeout(() => {
          isProcessingRef.current = false;
          setScanError(null);
        }, 3e3);
      }
    };
    const onScanFailure = (error) => {
    };
    scanner.render(onScanSuccess, onScanFailure);
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear html5-qrcode scanner. ", error);
      });
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl text-gray-800 leading-tight", children: "Admin Attendance Scanner" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Attendance Scanner" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Scan QR Code" }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.attendance.monitor"),
                className: "text-sm text-indigo-600 hover:text-indigo-900",
                children: "Back to Monitor"
              }
            )
          ] }),
          scanResult && /* @__PURE__ */ jsxs("div", { className: "mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative", role: "alert", children: [
            /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Success! " }),
            /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: scanResult.message })
          ] }),
          scanError && /* @__PURE__ */ jsxs("div", { className: "mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [
            /* @__PURE__ */ jsx("strong", { className: "font-bold", children: "Error! " }),
            /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: scanError })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50", children: /* @__PURE__ */ jsx("div", { id: "reader", className: "w-full" }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 text-center text-sm text-gray-500", children: "Point your camera at the session QR code to record attendance." })
        ] }) }) })
      ]
    }
  );
}
export {
  Scanner as default
};
