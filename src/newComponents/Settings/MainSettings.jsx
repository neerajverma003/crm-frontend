import { useState, useRef } from "react";
import { User, Shield, Bell, Monitor, Settings } from "lucide-react";
import Profile from "./Profile";
import Security from "./Security";
import Notifications from "./Notifications";
import Palette from "./Appearance";
import System from "./System";

const tabs = [
  { id: "tab-1", label: "Profile", icon: User, content: <Profile /> },
  { id: "tab-2", label: "Security", icon: Shield, content: <Security /> },
  { id: "tab-3", label: "Notifications", icon: Bell, content: <Notifications /> },
  { id: "tab-4", label: "Appearance", icon: Monitor, content: <Palette/> },
  { id: "tab-5", label: "Systems", icon: Settings, content: <System /> },
];


export default function MainSettings() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    let newIndex = index;

    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex].focus();
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8">
      {/* Tab List */}
      {/* <div
        role="tablist"
        aria-label="Settings Tabs"
        className="rounded-full flex justify-between bg-gray-300 p-1"
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeIndex === index
                  ? "bg-white rounded-full py-1 px-2"
                  : ""
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div> */}
      {/* Tab List */}
<div
  role="tablist"
  aria-label="Settings Tabs"
  className="rounded-full flex bg-gray-300 p-1"
>
  {tabs.map((tab, index) => {
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        id={tab.id}
        ref={(el) => (tabRefs.current[index] = el)}
        role="tab"
        aria-selected={activeIndex === index}
        aria-controls={`${tab.id}-panel`}
        tabIndex={activeIndex === index ? 0 : -1}
        onClick={() => setActiveIndex(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
          activeIndex === index ? "bg-white rounded-full" : ""
        }`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{tab.label}</span>
      </button>
    );
  })}
</div>


      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={tab.id}
          hidden={activeIndex !== index}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}