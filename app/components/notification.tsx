"use client";

import React from "react";

export function useNotification() {
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<"success" | "error">("success");

  const notify = (text: string, notifType: "success" | "error" = "success") => {
    setMessage(text);
    setType(notifType);
    setTimeout(() => setMessage(""), 3000);
  };

  return {
    notify,
    NotificationComponent: () => message ? (
      <div className={`fixed top-4 right-4 p-4 rounded ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}>
        {message}
      </div>
    ) : null
  };
}