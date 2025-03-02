import LicenseModal from "./modal_app";
import { useState } from "react";
import LicenseModalinstall from "./modal_app/install";
import { useQueryApi } from "~/hooks/useQuery";
import { ApplicationType } from "~/types";
import { AiOutlineCloudUpload } from "react-icons/ai";

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

  const OpenModal = (app: ApplicationType) => {
    setSelectedApp(app);
  };
  const OpenModalinstall = (app: ApplicationType) => {
    setSelectedApp1(app);
  };

  const CloseModal = () => {
    setSelectedApp(null);
  };
  const CloseModalInstall = () => {
    setSelectedApp1(null);
  };
  const search = (): ApplicationType[] => {
    if (!searchText.trim()) return applications;
    const text = searchText?.toLowerCase();
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
          {isLoading || isError ? (
            "Loading...."
          ) : Array.isArray(search()) ? (
            search().map((app: ApplicationType) => (
              <div key={`launchpad-${app.id}`} h="32 sm:36" flex="~ col">
                <a
                  className="w-14 text-white  sm:w-20 mx-auto cursor-pointer"
                  onClick={
                    app?.is_installed ? () => OpenModal(app) : () => OpenModalinstall(app)
                  }
                >
                  <img src={`/icons/${app.pathToIcon}`} alt={app?.application_name} />
                </a>
                <span
                  m="t-2 x-auto "
                  className="flex items-center gap-2 cursor-pointer"
                  text="white xs sm:sm"
                >
                  {!app?.is_installed && <AiOutlineCloudUpload size={20} />}
                  <p className="text-[16px] font-500">{app?.application_name}</p>
                </span>
              </div>
            ))
          ) : (
            <p>Not data</p>
          )}
        </div>
      </div>

      {selectedApp && <LicenseModal app={selectedApp} onClose={CloseModal} />}
      {selectedApp1 && (
        <LicenseModalinstall app={selectedApp1} onClose={CloseModalInstall} />
      )}
    </div>
  );
}
