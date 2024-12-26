"use client";
import React, { useState } from "react";
import Profile from "../user/components/Profile";

export default function Settings() {
  const listData = [{ title: "Account" }, { title: "Profile" }];

  const [selected, setSelected] = useState<string>("Account");

  const renderContent = () => {
    switch (selected) {
      case "Account":
        return <div className="p-4">Here are your account settings.</div>;
      case "Profile":
        return <Profile />;
      default:
        return <div className="p-4">Select an option to see details.</div>;
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="title">
          <h1 className="font-bold text-4xl text-black dark:text-white">
            Paramètres
          </h1>
        </div>
        <div className="list-title mt-5">
          <ul className="flex gap-7 text-black dark:text-white p-3">
            {listData.map((item, index) => (
              <li
                key={index}
                className={`hover:bg-gray-300 dark:hover:text-black px-4 py-2 rounded-md cursor-pointer ${
                  selected === item.title ? "bg-gray-300 dark:text-black" : ""
                }`}
                onClick={() => setSelected(item.title)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="content mt-5  text-black dark:text-white p-4 rounded-md">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
