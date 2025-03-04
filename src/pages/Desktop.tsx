import React, { useState, useEffect } from "react";
import { apps } from "~/configs";
import { minMarginY } from "~/utils";
import { useQueryApi } from "~/hooks/useQuery";
import { ApplicationType } from "~/types";
import LicenseModal from "~/components/modal_app";
import LicenseModalinstall from "~/components/modal_app/install";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface DesktopState {
  showApps: { [key: string]: boolean };
  appsZ: { [key: string]: number };
  maxApps: { [key: string]: boolean };
  minApps: { [key: string]: boolean };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
}

export default function Desktop(props: any) {
  const [state, setState] = useState({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedApp1, setSelectedApp1] = useState<any>(null);

  const { data, isLoading, isError } = useQueryApi({
    pathname: "application",
    url: "/api/1/desktop/web-applications"
  });

  const applications: ApplicationType[] = data || [];

  useEffect(() => {
    getAppsData();
  }, []);

  const getAppsData = (): void => {
    let showApps = {},
      appsZ = {},
      maxApps = {},
      minApps = {};
    apps.forEach((app) => {
      showApps = { ...showApps, [app.id]: !!app.show };
      appsZ = { ...appsZ, [app.id]: 2 };
      maxApps = { ...maxApps, [app.id]: false };
      minApps = { ...minApps, [app.id]: false };
    });
    setState({ ...state, showApps, appsZ, maxApps, minApps });
  };

  const toggleLaunchpad = (target: boolean): void => {
    const r = document.querySelector(`#launchpad`) as HTMLElement;
    if (r) {
      r.style.transform = target ? "scale(1)" : "scale(1.1)";
      r.style.transition = target ? "ease-in 0.2s" : "ease-out 0.2s";
    }
    setState({ ...state, showLaunchpad: target });
  };

  const toggleSpotlight = (): void => {
    setState({ ...state, spotlight: !state.spotlight });
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    if (r) {
      const rect = r.getBoundingClientRect();
      r.style.setProperty("--window-transform-x", `${window.innerWidth + rect.x}px`);
      r.style.setProperty("--window-transform-y", `${rect.y - minMarginY}px`);
    }
  };

  const setAppMax = (id: string, target?: boolean): void => {
    const maxApps = { ...state.maxApps };
    target = target === undefined ? !maxApps[id] : target;
    maxApps[id] = target;
    setState({ ...state, maxApps, hideDockAndTopbar: target });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    const minApps = { ...state.minApps };
    target = target === undefined ? !minApps[id] : target;
    minApps[id] = target;
    setState({ ...state, minApps });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const dock = document.querySelector(`#dock-${id}`) as HTMLElement;
    if (r && dock) {
      const dockRect = dock.getBoundingClientRect();
      const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
      const posX = window.innerWidth + dockRect.x - r.offsetWidth / 2 + 25;
      r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
      r.style.transition = "ease-out 0.3s";
      setAppMin(id, true);
    }
  };

  const closeApp = (id: string): void => {
    setAppMax(id, false);
    const showApps = { ...state.showApps };
    showApps[id] = false;
    setState({ ...state, showApps, hideDockAndTopbar: false });
  };

  const openApp = (id: string): void => {
    const showApps = { ...state.showApps };
    showApps[id] = true;
    const appsZ = { ...state.appsZ };
    const maxZ = state.maxZ + 1;
    appsZ[id] = maxZ;
    const currentApp = apps.find((app) => app.id === id);
    if (!currentApp) throw new TypeError(`App ${id} is undefined.`);

    setState({ ...state, showApps, appsZ, maxZ, currentTitle: currentApp.title });

    const minApps = { ...state.minApps };
    if (minApps[id]) {
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      if (r) {
        r.style.transform = `translate(${r.style.getPropertyValue("--window-transform-x")}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
        r.style.transition = "ease-in 0.3s";
        minApps[id] = false;
        setState({ ...state, minApps });
      }
    }
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (app.desktop && state.showApps[app.id]) {
        const props = {
          id: app.id,
          title: app.title,
          width: app.width,
          height: app.height,
          minWidth: app.minWidth,
          minHeight: app.minHeight,
          aspectRatio: app.aspectRatio,
          x: app.x,
          y: app.y,
          z: state.appsZ[app.id],
          max: state.maxApps[app.id],
          min: state.minApps[app.id],
          close: closeApp,
          setMax: setAppMax,
          setMin: minimizeApp,
          focus: openApp
        };
        return (
          <AppWindow key={`desktop-app-${app.id}`} {...props}>
            {app.content}
          </AppWindow>
        );
      }
      return <div key={`desktop-app-${app.id}`} />;
    });
  };

  const OpenModal = (app: ApplicationType) => setSelectedApp(app);
  const OpenModalinstall = (app: ApplicationType) => setSelectedApp1(app);
  const CloseModal = () => setSelectedApp(null);
  const CloseModalInstall = () => setSelectedApp1(null);

  const search = (): ApplicationType[] => {
    if (!searchText.trim()) return applications;
    const text = searchText.toLowerCase();
    return applications.filter(
      (item) =>
        item.application_name?.toLowerCase().includes(text) ||
        item.id?.toLowerCase().includes(text)
    );
  };

  const close = state.showLaunchpad
    ? ""
    : "opacity-0 invisible transition-opacity duration-200";

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{ background: "linear-gradient(to bottom, rgb(6, 70, 246), #ffffff)" }}
    >
      <TopBar
        title={state.currentTitle}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />
      <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
        {renderAppWindows()}
      </div>
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />

      {/* Integrated Launchpad-like Overlay */}
      <div
        className={`${close} z-30 size-full fixed overflow-hidden bg-gray-900/20 backdrop-blur-2xl`}
        id="launchpad"
        onClick={() => toggleLaunchpad(true)}
      >
        <div className="w-full h-full px-4">
          <div
            className="mx-auto flex h-8 w-64 xs:w-72 sm:w-80 mt-4 bg-gray-200/10 border border-gray-200/30 rounded-md"
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          >
            <div
              className={`${focus ? "w-6 duration-200" : "w-8 delay-250"} flex items-center justify-end`}
            >
              <span className="i-bx:search ml-1 text-white" />
            </div>
            <input
              className="flex-1 min-w-0 outline-none bg-transparent px-2 text-sm text-white placeholder-gray-300"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="max-w-[1100px] mx-auto mt-6 w-full">
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4 sm:gap-6">
              {isLoading || isError ? (
                <p className="text-white text-center col-span-full">Loading...</p>
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
                        src={`/icons/${app.pathToIcon}`}
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
                <p className="text-white text-center col-span-full">No data</p>
              )}
            </div>
          </div>
        </div>

        {selectedApp && <LicenseModal app={selectedApp} onClose={CloseModal} />}
        {selectedApp1 && (
          <LicenseModalinstall app={selectedApp1} onClose={CloseModalInstall} />
        )}
      </div>
    </div>
  );
}
