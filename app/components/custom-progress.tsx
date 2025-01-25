"use client";

import * as React from "react";

export function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-green-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}