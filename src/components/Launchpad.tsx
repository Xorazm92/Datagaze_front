import LicenseModal from "./modal_app";
import LicenseModalinstall from "./modal_app/install";
import { useState } from "react";
import { useQueryApi } from "~/hooks/useQuery";
import { ApplicationType } from "~/types";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Box, CircularProgress } from "@mui/material";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
}

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad }: LaunchpadProps) {
  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedApp1, setSelectedApp1] = useState<any>(null);

  const { data, isLoading, isError } = useQueryApi({
    pathname: "application",
    url: "/api/1/desktop/web-applications"
  });

  const applications: ApplicationType[] = data || [];

  const OpenModal = (app: ApplicationType) => setSelectedApp(app);
  const OpenModalinstall = (app: ApplicationType) => setSelectedApp1(app);
  const CloseModal = () => setSelectedApp(null);
  const CloseModalInstall = () => setSelectedApp1(null);

  const search = (): ApplicationType[] => {
    if (!searchText.trim()) return applications;
    const text = searchText.toLowerCase();
    return applications.filter((item) => {
      return (
        item.application_name?.toLowerCase().includes(text) ||
        item.id?.toLowerCase().includes(text)
      );
    });
  };

  const close = show ? "" : "opacity-0 invisible transition-opacity duration-200";

  return (
    <div
      className={`${close} z-30 transform scale-100 fixed overflow-hidden`}
      id="launchpad"
      style={{
        background: "linear-gradient(to bottom, rgb(6, 70, 246), #ffffff)"
      }}
      onClick={() => toggleLaunchpad(true)}
    >
      <div className="size-full absolute bg-gray-900/20 backdrop-blur-2xl">
        <div
          className="mx-auto flex h-8 w-64 xs:w-72 sm:w-80 mt-4 bg-gray-200/10 border border-gray-200/30 rounded-md"
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          <div
            className={`${
              focus ? "w-6 duration-200" : "w-8 delay-250"
            } flex items-center justify-end`}
          >
            <span className="i-bx:search ml-1 text-white" />
          </div>
          <input
            className="flex-1 min-w-0 outline-none bg-transparent px-2 text-sm text-white placeholder-gray-300"
            placeholder={placeholderText}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="mx-auto mt-6 w-full px-4">
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4 sm:gap-6">
            {isLoading || isError ? (
              <p className="text-white text-center col-span-full">
                Loading...
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              </p>
            ) : Array.isArray(search()) ? (
              search().map((app: ApplicationType) => (
                <div
                  key={`launchpad-${app.id}`}
                  className="flex flex-col items-center h-28 xs:h-32"
                >
                  <a
                    className="w-12 xs:w-14 sm:w-16 mx-auto cursor-pointer"
                    onClick={
                      app?.is_installed
                        ? () => OpenModal(app)
                        : () => OpenModalinstall(app)
                    }
                  >
                    <img
                      src={`/icons/${app?.pathToIcon}`}
                      alt={app?.application_name}
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <span className="mt-2 flex items-center gap-1 text-white text-center">
                    {!app?.is_installed && <AiOutlineCloudUpload size={16} />}
                    <p className="text-xs xs:text-sm sm:text-[16px] font-medium truncate max-w-full">
                      {app?.application_name}
                    </p>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white text-center col-span-full">No data...</p>
            )}
          </div>
        </div>
      </div>

      {selectedApp && <LicenseModal app={selectedApp} onClose={CloseModal} />}
      {selectedApp1 && (
        <LicenseModalinstall app={selectedApp1} onClose={CloseModalInstall} />
      )}
    </div>
  );
}
