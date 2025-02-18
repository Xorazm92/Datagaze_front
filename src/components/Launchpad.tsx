import { launchpadApps } from "~/configs";
import LicenseModal from "./modal_app";
import { useState } from "react";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
}

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad }: LaunchpadProps) {
  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);
  const [IsOpen, SetIsOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null); // Tanlangan mahsulot

  const OpenModal = (app: any) => {
    SetIsOpen(true);
    setSelectedApp(app); // Tanlangan mahsulotni saqlash
  };

  const CloseModal = () => {
    setSelectedApp(null); // Modalni yopganda, tanlangan mahsulotni tozalash
    SetIsOpen(false); // Modalni yopish
  };

  const search = () => {
    if (searchText === "") return launchpadApps;
    const text = searchText.toLowerCase();
    const list = launchpadApps.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
      );
    });
    return list;
  };

  const close = show ? "" : "opacity-0 invisible transition-opacity duration-200";

  return (
    <div
      className={`${close} z-30 transform scale-110 size-full fixed overflow-hidden bg-center bg-cover`}
      id="launchpad"
      style={{
        background: "linear-gradient(to bottom, rgb(6, 70, 246), #ffffff)"
      }}
      onClick={() => toggleLaunchpad(true)}
    >
      <div className="size-full absolute bg-gray-900/20 backdrop-blur-2xl">
        <div
          className="mx-auto flex h-7 w-64 mt-5 bg-gray-200/10"
          border="1 rounded-md gray-200/30"
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          <div
            className={`${
              focus ? "w-6 duration-200" : "w-26 delay-250"
            } hstack justify-end`}
          >
            <span className="i-bx:search ml-1 text-white" />
          </div>
          <input
            className="flex-1 min-w-0 no-outline bg-transparent px-1 text-sm text-white"
            placeholder={placeholderText}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div
          className="max-w-[1100px] mx-auto mt-8 w-full px-4 sm:px-10"
          grid="~ flow-row cols-4 sm:cols-7"
        >
          {search().map((app) => (
            <div key={`launchpad-${app.id}`} h="32 sm:36" flex="~ col">
              <a
                className="w-14 sm:w-20 mx-auto cursor-pointer"
                onClick={() => OpenModal(app)} // Tanlangan mahsulotni yuborish
              >
                <img src={app.img} alt={app.title} title={app.title} />
              </a>
              <span m="t-2 x-auto" text="white xs sm:sm">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal faqat tanlangan mahsulot mavjud bo'lsa ko'rsatiladi */}
      {IsOpen && selectedApp && (
        <LicenseModal app={selectedApp} onClose={CloseModal} /> // Tanlangan mahsulotni modalga uzatish
      )}
    </div>
  );
}
