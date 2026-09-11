import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { D as Dropdown } from "./Dropdown-BgvF6zKd.js";
import { Link, usePage, router, useForm } from "@inertiajs/react";
import { T as ThemeToggle } from "./ThemeToggle-BY9dagkZ.js";
import { useState, useEffect, useRef, Fragment as Fragment$1 } from "react";
import { T as TextInput } from "./TextInput-D0qTZeQv.js";
import axios from "axios";
import { P as ProfilePhoto } from "./ProfilePhoto-CJ2Z04pO.js";
import { Popover, Transition } from "@headlessui/react";
import { M as Modal } from "./Modal-CKHW52Ki.js";
import { S as SecondaryButton } from "./SecondaryButton-TjIrbn1G.js";
import { _ as __ } from "./lang-COBcTD8W.js";
import { P as PrimaryButton } from "./PrimaryButton-BNNL2gCI.js";
import { D as DangerButton } from "./DangerButton-B7to2Tbx.js";
import { F as Footer } from "./Footer-CDwTxrct.js";
import { u as useTheme } from "./useTheme-CngFDcs1.js";
function ApplicationLogo(props) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      ...props,
      src: "/assets/img/logo-rmd.png",
      alt: "Logo RMD"
    }
  );
}
function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "inline-flex items-center px-3 py-5 text-xs font-semibold transition-colors duration-150 focus:outline-none border-b-2 " + (active ? "border-[#dc2626] text-[#0c4a6e] dark:text-white" : "border-transparent text-[#1e6a9e]/70 dark:text-gray-400 hover:text-[#0c4a6e] dark:hover:text-gray-200 hover:border-[#0c4a6e]/30") + " " + className,
      children
    }
  );
}
function ResponsiveNavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: `flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${active ? "border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 dark:focus:border-indigo-600 dark:focus:bg-indigo-900 dark:focus:text-indigo-200" : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-700 dark:focus:text-gray-200"} text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`,
      children
    }
  );
}
function ChatWidget({ user }) {
  const { translations } = usePage().props;
  const __2 = (key, replace = {}) => {
    let translation = translations?.[key] || key;
    Object.keys(replace).forEach((key2) => {
      translation = translation.replace(":" + key2, replace[key2]);
    });
    return translation;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadBySender, setUnreadBySender] = useState({});
  const [unreadGlobalCount, setUnreadGlobalCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [lastGlobalId, setLastGlobalId] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatTarget, setChatTarget] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [retryQueue, setRetryQueue] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    if (!user?.id) return [];
    const saved = localStorage.getItem(`offline_queue_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [lastNotificationCount, setLastNotificationCount] = useState(-1);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineMessages();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineQueue]);
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`offline_queue_${user.id}`, JSON.stringify(offlineQueue));
    }
  }, [offlineQueue, user?.id]);
  const syncOfflineMessages = async () => {
    if (offlineQueue.length === 0) return;
    const queue = [...offlineQueue];
    setOfflineQueue([]);
    for (const msg of queue) {
      try {
        await sendMessage(msg.message, msg.receiver_id, msg.tempId);
      } catch (error) {
        setOfflineQueue((prev) => [...prev, msg]);
      }
    }
  };
  const fetchGlobalMessages = async (currentTab) => {
    try {
      const response = await axios.get("/api/chat/global", {
        params: { after_id: lastGlobalId }
      });
      if (response.data.length > 0) {
        const newMessages = response.data;
        setGlobalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = newMessages.filter((m) => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
        setLastGlobalId(newMessages[newMessages.length - 1].id);
        const fromOthers = newMessages.filter((m) => m.sender_id !== user.id).length;
        if (fromOthers > 0) {
          if (currentTab !== "global") {
            setUnreadGlobalCount((prev) => prev + fromOthers);
          }
          triggerNotification();
        }
      }
    } catch (error) {
      console.error("Failed to fetch global messages", error);
    }
  };
  const sendMessage = async (msgText, targetId, tempId = Date.now()) => {
    if (!isOnline) {
      const offlineMsg = {
        id: tempId,
        tempId,
        message: msgText,
        sender_id: user.id,
        receiver_id: targetId,
        status: "offline",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        sender: user
        // Add sender info for global chat display
      };
      if (targetId) {
        setMessages((prev) => [...prev, offlineMsg]);
      } else {
        setGlobalMessages((prev) => [...prev, offlineMsg]);
      }
      setOfflineQueue((prev) => [...prev, offlineMsg]);
      return;
    }
    const newMessage = {
      id: tempId,
      message: msgText,
      sender_id: user.id,
      receiver_id: targetId,
      status: "sending",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      sender: user
    };
    if (targetId) {
      if (!messages.find((m) => m.id === tempId)) {
        setMessages((prev) => [...prev, newMessage]);
      }
    } else {
      if (!globalMessages.find((m) => m.id === tempId)) {
        setGlobalMessages((prev) => [...prev, newMessage]);
      }
    }
    setIsSending(true);
    try {
      const response = await axios.post("/api/chat", {
        receiver_id: targetId,
        message: msgText
      });
      const updateStatus = (prev) => prev.map((m) => m.id === tempId ? { ...response.data, status: "sent", sender: user } : m);
      if (targetId) {
        setMessages(updateStatus);
      } else {
        setGlobalMessages(updateStatus);
        setLastGlobalId(response.data.id);
      }
    } catch (error) {
      const failStatus = (prev) => prev.map((m) => m.id === tempId ? { ...m, status: "failed" } : m);
      if (targetId) {
        setMessages(failStatus);
      } else {
        setGlobalMessages(failStatus);
      }
      setRetryQueue((prev) => [...prev, { ...newMessage, id: tempId }]);
      logChatError(error, "sendMessage");
    } finally {
      setIsSending(false);
    }
  };
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
  }, []);
  const logChatError = async (error, context) => {
    console.error(`Chat Error [${context}]:`, error);
    try {
      await axios.post("/api/log-error", {
        type: "chat",
        context,
        message: error.message,
        stack: error.stack,
        user_id: user.id
      });
    } catch (e) {
      const logs = JSON.parse(localStorage.getItem("chat_error_logs") || "[]");
      logs.push({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), context, error: error.message });
      localStorage.setItem("chat_error_logs", JSON.stringify(logs.slice(-20)));
    }
  };
  const fetchMessages = async (targetId) => {
    if (!targetId) return;
    try {
      const response = await axios.get(`/api/chat/${targetId}`);
      setMessages(response.data);
      await markAsRead(targetId);
    } catch (error) {
      logChatError(error, "fetchMessages");
    }
  };
  const [isAppInForeground, setIsAppInForeground] = useState(true);
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAppInForeground(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("/api/chat-unread");
      const newCount = response.data.count;
      if (lastNotificationCount !== -1 && newCount > lastNotificationCount) {
        triggerNotification();
      }
      setUnreadCount(newCount);
      setUnreadBySender(response.data.by_sender || {});
      setLastNotificationCount(newCount);
    } catch (error) {
      console.warn("Unread count fetch failed", error);
    }
  };
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "default"
  );
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      new Notification(__2("Notifications Enabled"), {
        body: __2("You will now receive alerts for new messages"),
        icon: "/favicon.ico"
      });
    }
  };
  const triggerNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play failed", e));
    }
    if (isAppInForeground) {
      if (!isOpen) {
        setToastMessage(__2("You have a new message!"));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5e3);
      }
    } else {
      if (notificationPermission === "granted") {
        new Notification(__2("New Message"), {
          body: __2("You have a new message in live chat"),
          icon: "/favicon.ico",
          tag: "chat-notification",
          renotify: true
        });
      }
    }
  };
  const markAsRead = async (targetId) => {
    try {
      await axios.patch(`/api/chat/${targetId}/read`);
      setUnreadBySender((prev) => {
        const next = { ...prev };
        delete next[String(targetId)];
        return next;
      });
      const response = await axios.get("/api/chat-unread");
      setUnreadCount(response.data.count);
      setUnreadBySender(response.data.by_sender || {});
      setLastNotificationCount(response.data.count);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };
  const fetchOnlineUsers = async (query = "") => {
    try {
      const response = await axios.get("/api/online-users", {
        params: { query }
      });
      setOnlineUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch online users", error);
    }
  };
  useEffect(() => {
    const handleStartChat = (event) => {
      const { user: targetUser } = event.detail;
      setIsOpen(true);
      setActiveTab("chat");
      setChatTarget(targetUser);
      fetchMessages(targetUser.id);
    };
    window.addEventListener("start-chat", handleStartChat);
    return () => window.removeEventListener("start-chat", handleStartChat);
  }, []);
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 2e3);
    return () => clearInterval(interval);
  }, [lastNotificationCount]);
  useEffect(() => {
    if (isOpen && activeTab === "global" && window.Echo) {
      window.Echo.join("chat.global").here((_users) => {
      }).joining((_user) => {
      }).leaving((_user) => {
      }).listen(".message.sent", (e) => {
        const newMsg = e.message;
        setGlobalMessages((prev) => {
          if (prev.find((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setLastGlobalId((prev) => Math.max(prev, newMsg.id));
        if (newMsg.sender_id !== user.id) {
          setActiveTab((tab) => {
            if (tab !== "global") {
              setUnreadGlobalCount((c) => c + 1);
            }
            return tab;
          });
          triggerNotification();
        }
        scrollToBottom();
      });
      return () => {
        window.Echo.leave("chat.global");
      };
    }
  }, [isOpen, activeTab]);
  useEffect(() => {
    if (isOpen) {
      fetchOnlineUsers(searchQuery);
      if (activeTab === "global") {
        fetchGlobalMessages(activeTab);
      }
      const interval = setInterval(() => {
        fetchOnlineUsers(searchQuery);
        if (chatTarget) {
          fetchMessages(chatTarget.id);
        }
        if (activeTab === "global") {
          fetchGlobalMessages(activeTab);
        }
      }, 3e3);
      return () => clearInterval(interval);
    }
  }, [isOpen, searchQuery, chatTarget, activeTab]);
  const toggleChat = () => {
    if (!isOpen) {
      fetchUnreadCount();
      if (activeTab === "global") setUnreadGlobalCount(0);
    }
    setIsOpen(!isOpen);
  };
  const resetChat = () => {
    setChatTarget(null);
    setMessages([]);
    setActiveTab("users");
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (isOpen && (activeTab === "chat" || activeTab === "global")) {
      scrollToBottom();
    }
  }, [messages, globalMessages, isOpen, activeTab]);
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || isSending) return;
    if (activeTab === "chat" && !chatTarget) return;
    const msgText = message;
    setMessage("");
    if (activeTab === "global") {
      await sendMessage(msgText, null);
    } else {
      await sendMessage(msgText, chatTarget.id);
    }
  };
  const retryMessage = async (failedMsg) => {
    if (failedMsg.status === "offline") {
      if (isOnline) {
        syncOfflineMessages();
      }
      return;
    }
    setIsSending(true);
    try {
      const response = await axios.post("/api/chat", {
        receiver_id: failedMsg.receiver_id,
        message: failedMsg.message
      });
      if (response.status === 201) {
        setMessages((prev) => prev.map((m) => m.id === failedMsg.id ? { ...response.data, status: "sent" } : m));
        setRetryQueue((prev) => prev.filter((m) => m.id !== failedMsg.id));
      }
    } catch (error) {
      logChatError(error, "retryMessage");
    } finally {
      setIsSending(false);
    }
  };
  useEffect(() => {
    if (retryQueue.length > 0 && !isSending) {
      const timer = setTimeout(() => {
        retryMessage(retryQueue[0]);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [retryQueue, isSending]);
  if (!user?.id) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-[9999] flex flex-col items-end", children: [
    showToast && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "mb-4 bg-white dark:bg-gray-800 border-l-4 border-blue-600 p-4 shadow-lg rounded animate-bounce flex items-center gap-3 cursor-pointer",
        onClick: () => {
          setIsOpen(true);
          setShowToast(false);
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-blue-100 dark:bg-blue-900 p-2 rounded-full", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: toastMessage }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: __2("Click to open") })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: (e) => {
            e.stopPropagation();
            setShowToast(false);
          }, className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "mb-4 w-80 sm:w-96 h-[500px] rounded-lg bg-white shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out transform origin-bottom-right", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-600 p-0 text-white flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 pb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            chatTarget && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: resetChat,
                  className: "mr-1 hover:bg-blue-700 rounded-full p-1",
                  title: __2("Back to Support"),
                  children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z", clipRule: "evenodd" }) })
                }
              ),
              /* @__PURE__ */ jsx(
                ProfilePhoto,
                {
                  src: chatTarget.avatar,
                  alt: chatTarget.name,
                  className: "w-8 h-8 rounded-full object-cover border border-white/20",
                  fallbackClassName: "w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold border border-white/20",
                  fallback: (chatTarget.name || "U").charAt(0).toUpperCase()
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm", children: chatTarget ? chatTarget.name : __2("Live Chat") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            notificationPermission === "default" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: requestNotificationPermission,
                className: "text-white hover:text-blue-200 transition-colors",
                title: __2("Enable Notifications"),
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleChat,
                className: "text-white hover:text-gray-200 focus:outline-none",
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
              }
            )
          ] })
        ] }),
        !chatTarget && /* @__PURE__ */ jsxs("div", { className: "flex px-4 space-x-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setActiveTab("global");
                setUnreadGlobalCount(0);
              },
              className: `pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "global" ? "border-white text-white" : "border-transparent text-blue-200 hover:text-white"}`,
              children: [
                __2("All Message"),
                unreadGlobalCount > 0 && /* @__PURE__ */ jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
                  /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("users"),
              className: `pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "users" ? "border-white text-white" : "border-transparent text-blue-200 hover:text-white"}`,
              children: [
                __2("Users"),
                /* @__PURE__ */ jsx("span", { className: "bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full", children: onlineUsers.length }),
                unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
                  /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-gray-900", children: [
        activeTab === "global" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col space-y-3", children: [
            globalMessages.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 text-xs mt-4", children: __2("Welcome to Global Chat!") }),
            globalMessages.map((msg) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex flex-col max-w-[85%] ${msg.sender_id === user.id ? "self-end items-end" : "self-start items-start"}`,
                children: [
                  msg.sender_id !== user.id && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-500 mb-1 ml-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: msg.sender?.name || "Unknown" }),
                    msg.sender?.role && /* @__PURE__ */ jsx("span", { className: "bg-gray-200 dark:bg-gray-700 px-1 rounded text-[9px]", children: msg.sender.role })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `px-4 py-2 rounded-lg text-sm relative group ${msg.sender_id === user.id ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"} ${msg.status === "failed" ? "border-red-500" : ""} ${msg.status === "offline" ? "border-dashed border-gray-400 opacity-70" : ""}`,
                      children: [
                        msg.message,
                        msg.status === "failed" && msg.sender_id === user.id && /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => retryMessage(msg),
                            className: "absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700",
                            title: __2("Retry"),
                            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z", clipRule: "evenodd" }) })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mt-1", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }) })
                ]
              },
              msg.id
            )),
            /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
          ] }),
          /* @__PURE__ */ jsx("form", { onSubmit: handleSendMessage, className: "p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "text",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                placeholder: __2("Type your message..."),
                className: "w-full text-sm"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: !message.trim(),
                className: "p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" }) })
              }
            )
          ] }) })
        ] }),
        activeTab === "chat" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col space-y-3", children: [
            messages.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 text-xs mt-4", children: __2("No messages yet. Say hello!") }),
            messages.map((msg) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex flex-col max-w-[80%] ${msg.sender_id === user.id ? "self-end items-end" : "self-start items-start"}`,
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `px-4 py-2 rounded-lg text-sm relative group ${msg.sender_id === user.id ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"} ${msg.status === "failed" ? "border-red-500" : ""} ${msg.status === "offline" ? "border-dashed border-gray-400 opacity-70" : ""}`,
                      children: [
                        msg.message,
                        msg.status === "failed" && msg.sender_id === user.id && /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => retryMessage(msg),
                            className: "absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700",
                            title: __2("Retry"),
                            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z", clipRule: "evenodd" }) })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
                    msg.sender_id === user.id && /* @__PURE__ */ jsxs("span", { className: "text-[10px]", children: [
                      msg.status === "sending" && /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-3 w-3 text-gray-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                      ] }),
                      msg.status === "sent" && !msg.is_read && /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 text-gray-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                      msg.is_read && /* @__PURE__ */ jsxs("div", { className: "flex -space-x-1", children: [
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 text-blue-500", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 text-blue-500", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) })
                      ] }),
                      msg.status === "offline" && /* @__PURE__ */ jsx("span", { className: "text-[8px] text-gray-400 italic", children: "offline" }),
                      msg.status === "failed" && /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 text-red-500", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) })
                    ] })
                  ] })
                ]
              },
              msg.id
            )),
            /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
          ] }),
          /* @__PURE__ */ jsx("form", { onSubmit: handleSendMessage, className: "p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "text",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                placeholder: __2("Type your message..."),
                className: "w-full text-sm"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: !message.trim(),
                className: "p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" }) })
              }
            )
          ] }) })
        ] }),
        activeTab === "users" && /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsx(
            TextInput,
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: __2("Search users..."),
              className: "w-full text-sm"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: onlineUsers.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: __2("No active users found") }) }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: onlineUsers.map((u) => /* @__PURE__ */ jsxs(
            "li",
            {
              onClick: () => {
                setChatTarget(u);
                setActiveTab("chat");
                fetchMessages(u.id);
              },
              className: "flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    ProfilePhoto,
                    {
                      src: u.avatar,
                      alt: u.name,
                      className: "w-10 h-10 rounded-full object-cover",
                      fallbackClassName: "w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs",
                      fallback: (u.name || "U").charAt(0).toUpperCase()
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-50 dark:border-gray-900 ${u.status === "online" ? "bg-green-500" : "bg-gray-400"}` })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: u.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-gray-500 dark:text-gray-400", children: [
                    /* @__PURE__ */ jsx("span", { className: "capitalize mr-2 bg-gray-100 dark:bg-gray-700 px-1.5 rounded", children: u.role }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: u.last_active })
                  ] })
                ] }),
                unreadBySender[String(u.id)] > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1", children: unreadBySender[String(u.id)] > 9 ? "9+" : unreadBySender[String(u.id)] })
              ]
            },
            u.id
          )) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      (unreadCount > 0 || unreadGlobalCount > 0) && !isOpen && /* @__PURE__ */ jsxs("span", { className: "absolute -top-1 -right-1 z-50", children: [
        /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
        /* @__PURE__ */ jsx("span", { className: "relative inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md", children: unreadCount + unreadGlobalCount > 9 ? "9+" : unreadCount + unreadGlobalCount })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleChat,
          className: `${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"} transition-all duration-300 transform bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`,
          "aria-label": __2("Open Chat"),
          children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) })
        }
      )
    ] })
  ] });
}
function NotificationBell() {
  const { auth } = usePage().props;
  const [notifications, setNotifications] = useState(auth.unread_notifications || []);
  const [unreadCount, setUnreadCount] = useState(auth.unread_notifications_count || 0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(route("api.notifications.unread"), {
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (!response.ok) return;
        const data = await response.json();
        setNotifications(data.unread_notifications);
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    const interval = setInterval(fetchNotifications, 3e4);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setNotifications(auth.unread_notifications || []);
    setUnreadCount(auth.unread_notifications_count || 0);
  }, [auth.unread_notifications, auth.unread_notifications_count]);
  const getRedirectRoute = (notification) => {
    const nType = notification.type || "";
    const data = notification.data || {};
    const role = auth.user.role;
    if (nType.includes("GiftProofUploaded")) {
      return () => router.get(route("gifts.index"), { status: "pending_verification" });
    }
    if (nType.includes("GiftVerified") || nType.includes("GiftAssigned") || data.type === "gift_assigned") {
      return () => router.get(route("gifts.index"));
    }
    if (nType.includes("ScheduleApprovalRequest") || data.type === "schedule_approval_request") {
      return () => router.get(route("admin.schedule-approval.index"));
    }
    if (nType.includes("ScheduleDecision") || data.meeting_id && data.status !== void 0) {
      if (role === "mentor") return () => router.get(route("mentor.schedule"));
      if (role === "participant") return () => router.get(route("participant.schedule"));
      return () => router.get(route("schedule.index"));
    }
    if (nType.includes("ScheduleActivity") || data.type === "schedule_activity") {
      if (role === "admin") return () => router.get(route("schedule.index"));
      if (role === "mentor") return () => router.get(route("mentor.schedule"));
      return () => router.get(route("participant.schedule"));
    }
    if (nType.includes("MeetingScheduled")) {
      if (role === "mentor") return () => router.get(route("mentor.schedule"));
      if (role === "participant") return () => router.get(route("participant.schedule"));
    }
    return null;
  };
  const handleNotificationClick = (notification) => {
    const redirect = getRedirectRoute(notification);
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    router.post(route("notifications.read", notification.id), {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (redirect) {
          redirect();
        } else {
          setSelectedNotification(notification);
          setIsModalOpen(true);
        }
      }
    });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(Popover, { className: "relative", children: ({ open }) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Popover.Button, { className: `
                            relative w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                            transition-all duration-300 ease-in-out
                            ${open ? "bg-gray-100 dark:bg-gray-800 text-indigo-500 dark:text-indigo-400" : ""}
                        `, children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: __("View notifications") }),
        /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }),
        unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/4 translate-x-1/4", children: [
          /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
          /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center", children: unreadCount > 9 ? "9+" : unreadCount })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Transition,
        {
          as: Fragment$1,
          enter: "transition ease-out duration-200",
          enterFrom: "opacity-0 translate-y-1",
          enterTo: "opacity-100 translate-y-0",
          leave: "transition ease-in duration-150",
          leaveFrom: "opacity-100 translate-y-0",
          leaveTo: "opacity-0 translate-y-1",
          children: /* @__PURE__ */ jsxs(Popover.Panel, { className: "absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: __("Notifications") }),
              unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium", children: [
                unreadCount,
                " ",
                __("New")
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.length > 0 ? notifications.map((notification) => {
              const nType = notification.type || "";
              const data = notification.data || {};
              const hasRedirect = !!getRedirectRoute(notification);
              const title = nType.includes("GiftProofUploaded") ? __("New Gift Proof") : nType.includes("GiftVerified") ? __("Gift Status Updated") : nType.includes("GiftAssigned") ? __("Gift Assigned") : data.type === "gift_assigned" ? __("Gift Assigned") : data.type === "schedule_deletion_request" ? __("Schedule Deletion Request") : nType.includes("ScheduleApprovalRequest") || data.type === "schedule_approval_request" ? __("New Schedule Request") : nType.includes("ScheduleDecision") ? __("Schedule Decision") : nType.includes("ScheduleActivity") || data.type === "schedule_activity" ? __("New Activity Schedule") : nType.includes("MeetingScheduled") ? __("Meeting Scheduled") : __("New Notification");
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleNotificationClick(notification),
                  className: `w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-0 ${!notification.read_at ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: title }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2", children: [
                        hasRedirect && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-indigo-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
                        !notification.read_at && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 bg-blue-500 rounded-full" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2", children: data.message || data.title || __("You have a new notification.") }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: new Date(notification.created_at).toLocaleString() }),
                      data.gift_code && /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300", children: data.gift_code })
                    ] })
                  ]
                },
                notification.id
              );
            }) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-300 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }),
              __("No new notifications.")
            ] }) })
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      selectedNotification && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10", children: /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-yellow-600", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold leading-6 text-gray-900 dark:text-gray-100", children: __("Selamat! Anda Menerima Hadiah") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-300", children: [
              __("Hadiah dengan ID Hadiah"),
              ": ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 dark:text-white", children: selectedNotification.data.gift_code })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300 font-medium", children: __("Hubungi Mentor Kamu untuk memproses hadiah.") }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: __("Tutup") }) })
    ] }) })
  ] });
}
function ProfilePhotoUpdateModal({ show, onClose }) {
  const user = usePage().props.auth.user;
  const photoInput = useRef();
  const [preview, setPreview] = useState(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    photo: null
  });
  useEffect(() => {
    if (!show) {
      reset();
      clearErrors();
      setPreview(null);
    }
  }, [show]);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(__("File size must be less than 2MB"));
        e.target.value = null;
        return;
      }
      setData("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    const routeName = user.role === "mentor" ? "mentor.profile-photo.request" : "participant.profile-photo.request";
    post(route(routeName), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        setPreview(null);
      }
    });
  };
  const closeModal = () => {
    onClose();
    reset();
    clearErrors();
    setPreview(null);
  };
  return /* @__PURE__ */ jsx(Modal, { show, onClose: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Update Profile Photo") }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: __("Upload a new profile photo. Max 2MB, JPG/PNG.") }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-900", children: preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: __("New Photo Preview"), className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(
          ProfilePhoto,
          {
            src: user.profile_photo_url,
            alt: __("Current Photo"),
            className: "w-full h-full object-cover",
            fallbackClassName: "w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold",
            fallback: (user.name || user.first_name || "U").charAt(0)
          }
        ) }),
        user.profile_photo_status === "pending" && !preview && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-sm", children: __("Pending") })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "w-full", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            ref: photoInput,
            className: "hidden",
            onChange: handlePhotoChange,
            accept: "image/png, image/jpeg, image/jpg"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-center", children: /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: () => photoInput.current.click(), children: __("Select New Photo") }) }),
        errors.photo && /* @__PURE__ */ jsx("div", { className: "mt-2 text-center text-sm text-red-600 dark:text-red-400", children: errors.photo }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, disabled: processing, children: __("Cancel") }),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: !data.photo || processing, className: "ml-3", children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }),
            __("Uploading...")
          ] }) : __("Save") })
        ] })
      ] })
    ] })
  ] }) });
}
function AuthenticatedLayout({ header, children }) {
  const { auth, flash, locale } = usePage().props;
  const user = auth?.user || {};
  const role = user?.role || "participant";
  const [showFlash, setShowFlash] = useState(true);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [showingPhotoModal, setShowingPhotoModal] = useState(false);
  useEffect(() => {
    setShowFlash(true);
    const timer = setTimeout(() => setShowFlash(false), 5e3);
    return () => clearTimeout(timer);
  }, [flash]);
  const confirmLogout = (e) => {
    e.preventDefault();
    setConfirmingLogout(true);
  };
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setConfirmingLogout(false);
    router.post(route("logout"));
  };
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [showingPhotoPreview, setShowingPhotoPreview] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex flex-col", children: [
    /* @__PURE__ */ jsxs("nav", { className: "shadow-md bg-[#E6F5FC] dark:bg-gray-900", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-16 justify-between items-stretch", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-stretch flex-wrap gap-y-0", children: [
          /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center pr-6", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "block h-12 w-auto fill-current text-[#0c4a6e]" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex sm:items-end sm:flex-wrap sm:gap-y-0", children: [
            /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("dashboard"),
                active: route().current("dashboard"),
                children: __("Dashboard")
              }
            ),
            user.role === "participant" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                NavLink,
                {
                  href: route("rmd.index"),
                  active: route().current("rmd.*"),
                  children: __("RMD")
                }
              ),
              /* @__PURE__ */ jsx(
                NavLink,
                {
                  href: route("participant.schedule"),
                  active: route().current("participant.schedule"),
                  children: __("My Schedule")
                }
              ),
              /* @__PURE__ */ jsx(
                NavLink,
                {
                  href: route("participant.notes"),
                  active: route().current("participant.notes"),
                  children: __("Notes")
                }
              )
            ] }),
            (user.role === "admin" || user.role === "mentor") && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("participants.index"),
                active: route().current("participants.index"),
                children: __("Participants")
              }
            ),
            user.role === "admin" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("mentors.index"),
                active: route().current("mentors.index"),
                children: __("Mentors")
              }
            ),
            user.role === "mentor" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("mentor.schedule"),
                active: route().current("mentor.schedule"),
                children: __("Schedule")
              }
            ),
            user.role === "mentor" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("attendance.index"),
                active: route().current("attendance.index"),
                children: __("Attendance")
              }
            ),
            (user.role === "admin" || user.role === "mentor") && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("communication.index"),
                active: route().current("communication.index"),
                children: __("Communication")
              }
            ),
            user.role === "admin" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("rmd.dashboard"),
                active: route().current("rmd.dashboard"),
                children: __("RMD Dashboard")
              }
            ),
            user.role === "admin" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("rmd-report.index"),
                active: route().current("rmd-report.index"),
                children: __("RMD Report")
              }
            ),
            user.role === "admin" && /* @__PURE__ */ jsx(
              NavLink,
              {
                href: route("admin.mentor-performance.index"),
                active: route().current("admin.mentor-performance.index"),
                children: __("Mentor Performance")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:flex sm:items-center sm:self-stretch shrink-0 px-4", children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(NotificationBell, {}),
          /* @__PURE__ */ jsx(ThemeToggle, { theme, toggleTheme }),
          /* @__PURE__ */ jsxs(Dropdown, { children: [
            /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "inline-flex items-center gap-2 h-10 px-2 rounded-full text-sm font-semibold text-[#0c4a6e] hover:bg-[#0c4a6e]/10 focus:outline-none transition duration-150 ease-in-out",
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowingPhotoPreview(true);
                      },
                      className: "cursor-pointer rounded-full ring-2 ring-transparent hover:ring-[#0c4a6e]/40 transition",
                      children: /* @__PURE__ */ jsx(
                        ProfilePhoto,
                        {
                          src: user.profile_photo_url,
                          alt: user.name,
                          className: "h-8 w-8 rounded-full object-cover",
                          fallbackClassName: "h-8 w-8 rounded-full bg-[#0c4a6e]/20 flex items-center justify-center text-[#0c4a6e] text-xs font-bold",
                          fallback: (user.first_name_display || user.name || "U").charAt(0)
                        }
                      )
                    }
                  ),
                  user?.first_name_display || user?.name || __("User"),
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "h-4 w-4",
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          fillRule: "evenodd",
                          d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                          clipRule: "evenodd"
                        }
                      )
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
              /* @__PURE__ */ jsx("div", { className: "block px-4 py-2 text-xs text-gray-400", children: __("Manage Account") }),
              /* @__PURE__ */ jsx(
                Dropdown.Link,
                {
                  href: route("profile.edit"),
                  children: __("Profile")
                }
              ),
              (role === "mentor" || role === "participant") && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
                  onClick: () => setShowingPhotoModal(true),
                  children: __("Change Profile Photo")
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-gray-600 my-1" }),
              /* @__PURE__ */ jsx("div", { className: "block px-4 py-2 text-xs text-gray-400", children: __("Language") }),
              /* @__PURE__ */ jsx(
                Dropdown.Link,
                {
                  as: "button",
                  href: route("language.switch", "id"),
                  method: "post",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { children: __("Bahasa") }),
                    locale === "id" && /* @__PURE__ */ jsx("span", { className: "text-green-500", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                Dropdown.Link,
                {
                  as: "button",
                  href: route("language.switch", "en"),
                  method: "post",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { children: __("English") }),
                    locale === "en" && /* @__PURE__ */ jsx("span", { className: "text-green-500", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 dark:border-gray-600 my-1" }),
              /* @__PURE__ */ jsx(
                Dropdown.Link,
                {
                  as: "button",
                  type: "button",
                  onClick: confirmLogout,
                  children: __("Log Out")
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 sm:hidden", children: [
          /* @__PURE__ */ jsx(NotificationBell, {}),
          /* @__PURE__ */ jsx(ThemeToggle, { theme, toggleTheme }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowingNavigationDropdown(
                (previousState) => !previousState
              ),
              className: "w-10 h-10 flex items-center justify-center rounded-full text-[#0c4a6e] transition duration-150 ease-in-out hover:bg-[#0c4a6e]/10 focus:outline-none",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "h-6 w-6",
                  stroke: "currentColor",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        className: !showingNavigationDropdown ? "inline-flex" : "hidden",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        d: "M4 6h16M4 12h16M4 18h16"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        className: showingNavigationDropdown ? "inline-flex" : "hidden",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        d: "M6 18L18 6M6 6l12 12"
                      }
                    )
                  ]
                }
              )
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: (showingNavigationDropdown ? "block" : "hidden") + " sm:hidden bg-[#E6F5FC] dark:bg-gray-900",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 pb-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("dashboard"),
                  active: route().current("dashboard"),
                  children: __("Dashboard")
                }
              ),
              user.role === "participant" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    href: route("rmd.index"),
                    active: route().current("rmd.*"),
                    children: __("RMD")
                  }
                ),
                /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    href: route("participant.schedule"),
                    active: route().current("participant.schedule"),
                    children: __("My Schedule")
                  }
                ),
                /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    href: route("participant.notes"),
                    active: route().current("participant.notes"),
                    children: __("Notes")
                  }
                )
              ] }),
              (user.role === "admin" || user.role === "mentor") && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("participants.index"),
                  active: route().current("participants.index"),
                  children: __("Participants")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("mentors.index"),
                  active: route().current("mentors.index"),
                  children: __("Mentors")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("admin.schedule-approval.index"),
                  active: route().current("admin.schedule-approval.index"),
                  children: __("Schedule Approval")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("communication.index"),
                  active: route().current("communication.index"),
                  children: __("Communication")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("rmd.dashboard"),
                  active: route().current("rmd.dashboard"),
                  children: __("RMD Dashboard")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("rmd-report.index"),
                  active: route().current("rmd-report.index"),
                  children: __("RMD Report")
                }
              ),
              user.role === "admin" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("admin.mentor-performance.index"),
                  active: route().current("admin.mentor-performance.index"),
                  children: __("Mentor Performance")
                }
              ),
              user.role === "mentor" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("mentor.schedule"),
                  active: route().current("mentor.schedule"),
                  children: __("Schedule")
                }
              ),
              user.role === "mentor" && /* @__PURE__ */ jsx(
                ResponsiveNavLink,
                {
                  href: route("attendance.index"),
                  active: route().current("attendance.index"),
                  children: __("Attendance")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-white/30 pb-1 pt-4 bg-black/10", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowingPhotoPreview(true),
                    className: "shrink-0 rounded-full ring-2 ring-transparent hover:ring-[#0c4a6e]/40 transition focus:outline-none",
                    children: /* @__PURE__ */ jsx(
                      ProfilePhoto,
                      {
                        src: user.profile_photo_url,
                        alt: user.name,
                        className: "h-10 w-10 rounded-full object-cover",
                        fallbackClassName: "h-10 w-10 rounded-full bg-[#0c4a6e]/20 flex items-center justify-center text-[#0c4a6e] text-sm font-bold",
                        fallback: (user.first_name_display || user.name || "U").charAt(0)
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-[#0c4a6e]", children: user.first_name_display || user.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-[#1e6a9e]", children: user.email })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
                /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("profile.edit"), children: __("Profile") }),
                /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    as: "button",
                    type: "button",
                    onClick: confirmLogout,
                    children: __("Log Out")
                  }
                )
              ] })
            ] })
          ]
        }
      )
    ] }),
    header && /* @__PURE__ */ jsx("header", { className: "bg-white shadow dark:bg-gray-800 transition-colors duration-200", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8", children: header }) }),
    showFlash && flash?.info && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-300 text-blue-700 px-4 py-3 rounded relative dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700", role: "alert", children: [
      /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: flash.info }),
      /* @__PURE__ */ jsx("span", { className: "absolute top-0 bottom-0 right-0 px-4 py-3", onClick: () => setShowFlash(false), children: /* @__PURE__ */ jsxs("svg", { className: "fill-current h-6 w-6 text-blue-400 dark:text-blue-300", role: "button", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: [
        /* @__PURE__ */ jsx("title", { children: __("Close") }),
        /* @__PURE__ */ jsx("path", { d: "M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" })
      ] }) })
    ] }) }),
    showFlash && flash?.success && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-800 dark:text-green-100 dark:border-green-600", role: "alert", children: [
      /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: flash.success }),
      /* @__PURE__ */ jsx("span", { className: "absolute top-0 bottom-0 right-0 px-4 py-3", onClick: () => setShowFlash(false), children: /* @__PURE__ */ jsxs("svg", { className: "fill-current h-6 w-6 text-green-500 dark:text-green-300", role: "button", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: [
        /* @__PURE__ */ jsx("title", { children: __("Close") }),
        /* @__PURE__ */ jsx("path", { d: "M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" })
      ] }) })
    ] }) }),
    showFlash && flash?.error && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-800 dark:text-red-100 dark:border-red-600", role: "alert", children: [
      /* @__PURE__ */ jsx("span", { className: "block sm:inline", children: flash.error }),
      /* @__PURE__ */ jsx("span", { className: "absolute top-0 bottom-0 right-0 px-4 py-3", onClick: () => setShowFlash(false), children: /* @__PURE__ */ jsxs("svg", { className: "fill-current h-6 w-6 text-red-500 dark:text-red-300", role: "button", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: [
        /* @__PURE__ */ jsx("title", { children: __("Close") }),
        /* @__PURE__ */ jsx("path", { d: "M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(ChatWidget, { user }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingLogout, onClose: () => setConfirmingLogout(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: __("Are you sure you want to log out?") }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setConfirmingLogout(false), children: __("Cancel") }),
        /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", onClick: logout, children: __("Yes, Log Out") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ProfilePhotoUpdateModal,
      {
        show: showingPhotoModal,
        onClose: () => setShowingPhotoModal(false)
      }
    ),
    showingPhotoPreview && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm",
        onClick: () => setShowingPhotoPreview(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative flex flex-col items-center gap-3 p-4",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowingPhotoPreview(false),
                  className: "absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              ),
              user.profile_photo_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: user.profile_photo_url,
                  alt: user.name,
                  className: "w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover shadow-2xl ring-4 ring-white/30"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#0c4a6e]/80 flex items-center justify-center text-white text-7xl font-bold shadow-2xl ring-4 ring-white/30", children: (user.first_name_display || user.name || "U").charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsx("p", { className: "text-white font-semibold text-lg drop-shadow", children: user.first_name_display || user.name })
            ]
          }
        )
      }
    )
  ] });
}
export {
  AuthenticatedLayout as A
};
