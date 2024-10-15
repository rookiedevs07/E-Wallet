// import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-6 rounded-xl bg-[#ededed] w-full">
      <h1 className="text-xl border-b pb-2">{title}</h1>
      {/* Render children directly without wrapping in a <p> */}
      <div>{children}</div>
    </div>
  );
}
