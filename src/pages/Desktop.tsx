import React from "react";
import { apps } from "~/configs";
import { minMarginY } from "~/utils";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
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
    servispad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const getAppsData = (): void => {
    let showApps = {},
      appsZ = {},
      maxApps = {},
      minApps = {};

    apps.forEach((app) => {
      showApps = {
        ...showApps,
        [app.id]: !!app.show
      };
      appsZ = {
        ...appsZ,
        [app.id]: 2
      };
      maxApps = {
        ...maxApps,
        [app.id]: false
      };
      minApps = {
        ...minApps,
        [app.id]: false
      };
    });

    setState({ ...state, showApps, appsZ, maxApps, minApps });
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleLaunchpad = (target: boolean): void => {
    const r = document.querySelector(`#launchpad`) as HTMLElement;
    if (target) {
      r.style.transform = "scale(1)";
      r.style.transition = "ease-in 0.2s";
    } else {
      r.style.transform = "scale(1.1)";
      r.style.transition = "ease-out 0.2s";
    }

    setState({ ...state, showLaunchpad: target });
  };

  const toggleSpotlight = (): void => {
    setState({ ...state, spotlight: !state.spotlight });
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
  };

  const setAppMax = (id: string, target?: boolean): void => {
    const maxApps = state.maxApps;
    if (target === undefined) target = !maxApps[id];
    maxApps[id] = target;
    setState({
      ...state,
      maxApps: maxApps,
      hideDockAndTopbar: target
    });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    const minApps = state.minApps;
    if (target === undefined) target = !minApps[id];
    minApps[id] = target;
    setState({
      ...state,
      minApps: minApps
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);

    // get the corrosponding dock icon's position
    let r = document.querySelector(`#dock-${id}`) as HTMLElement;
    const dockAppRect = r.getBoundingClientRect();

    r = document.querySelector(`#window-${id}`) as HTMLElement;
    // const appRect = r.getBoundingClientRect();
    const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
    // "+ window.innerWidth" because of the boundary for windows
    const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

    // translate the window to that position
    r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    r.style.transition = "ease-out 0.3s";

    // add it to the minimized app list
    setAppMin(id, true);
  };

  const closeApp = (id: string): void => {
    setAppMax(id, false);
    const showApps = state.showApps;
    showApps[id] = false;
    setState({
      ...state,
      showApps: showApps,
      hideDockAndTopbar: false
    });
  };

  const openApp = (id: string): void => {
    // add it to the shown app list
    const showApps = state.showApps;
    showApps[id] = true;

    // move to the top (use a maximum z-index)
    const appsZ = state.appsZ;
    const maxZ = state.maxZ + 1;
    appsZ[id] = maxZ;

    // get the title of the currently opened app
    const currentApp = apps.find((app) => {
      return app.id === id;
    });
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    setState({
      ...state,
      showApps: showApps,
      appsZ: appsZ,
      maxZ: maxZ,
      currentTitle: currentApp.title
    });

    const minApps = state.minApps;
    // if the app has already been shown but minimized
    if (minApps[id]) {
      // move to window's last position
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      r.style.transform = `translate(${r.style.getPropertyValue(
        "--window-transform-x"
      )}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
      r.style.transition = "ease-in 0.3s";
      // remove it from the minimized app list
      minApps[id] = false;
      setState({ ...state, minApps });
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
      } else {
        return <div key={`desktop-app-${app.id}`} />;
      }
    });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{
        background: "linear-gradient(to bottom, rgb(6, 70, 246), #ffffff)"
      }}
    >
      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />
      {/* Desktop Apps */}
      <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
        {renderAppWindows()}
      </div>
      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}
      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />
      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />
      <div className="flex flex-col  mt-[150px] items-center justify-center">
        <h1 className="text-5xl text-[#92bff6] font-bold">Good afternoon, Jam.</h1>
        <div className="flex mt-4 items-center gap-6 justify-center m-auto h-[50vh]">
          <div
            style={{
              background: "linear-gradient(to bottom, #6885c4,rgba(255, 255, 255, 0.52))"
            }}
            className="w-[400px] flex-col gap-3 h-[320px]  rounded-2xl flex items-center justify-center"
          >
            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-[12px] font-semibold rounded-full w-[80px] p-2 bg-[#7992ca] flex items-center justify-center text-white">
                  ACTIVATED
                </p>
                <p className="text-[32px] font-medium text-white">DataGaze DLP</p>
                <p className="font-medium text-[14px] text-white">
                  available 500 licenses
                </p>
              </div>
              <img
                className="w-[40px] h-[40px]"
                src="../../../public/logo/1.png"
                alt="logo"
              />
            </div>
            <div>
              <div className="flex flex-col items-center w-full mt-10">
                <div className="flex justify-between w-[350px] text-white text-sm mb-2">
                  <span>0</span>
                  <span>250</span>
                  <span>500</span>
                </div>
                <div className="relative w-[350px] h-[40px] flex items-center">
                  <div className="absolute w-full h-[8px]  rounded-full"></div>

                  <div className="flex justify-between w-full px-1">
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-[20px] h-[40px] bg-white rounded"></div>
                </div>
              </div>
              <p className="font-medium text-[12px] text-white mt-6 flex items-center gap-2">
                <span className="bg-white w-[8px] h-[8px] rounded-[50%]"></span>
                RUNNING ON 238 COMPUTERS
              </p>
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #6885c4,rgba(255, 255, 255, 0.52))"
            }}
            className="w-[400px] flex-col gap-3 h-[320px]  rounded-2xl flex items-center justify-center"
          >
            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-[12px] font-semibold rounded-full w-[80px] p-2 bg-[#7992ca] flex items-center justify-center text-white">
                  ACTIVATED
                </p>
                <p className="text-[32px] font-medium text-white">DataGaze SIEM</p>
                <p className="font-medium text-[14px] text-white">
                  available 500 licenses
                </p>
              </div>
              <img
                className="w-[40px] h-[40px]"
                src="../../../public/logo/siem.png"
                alt="logo"
              />
            </div>
            <div>
              <div className="flex flex-col items-center w-full mt-10">
                <div className="flex justify-between w-[350px] text-white text-sm mb-2">
                  <span>0</span>
                  <span>250</span>
                  <span>500</span>
                </div>
                <div className="relative w-[350px] h-[40px] flex items-center">
                  <div className="absolute w-full h-[8px]  rounded-full"></div>

                  <div className="flex justify-between w-full px-1">
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-[20px] h-[40px] bg-white rounded"></div>
                </div>
              </div>
              <p className="font-medium text-[12px] text-white mt-6 flex items-center gap-2">
                <span className="bg-white w-[8px] h-[8px] rounded-[50%]"></span>
                RUNNING ON 238 COMPUTERS
              </p>
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #6885c4,rgba(255, 255, 255, 0.52))"
            }}
            className="w-[400px] flex-col gap-3 h-[320px]  rounded-2xl flex items-center justify-center"
          >
            <div className="flex items-center justify-between w-[80%]">
              <div>
                <p className="text-[12px] font-semibold rounded-full w-[80px] p-2 bg-[#7992ca] flex items-center justify-center text-white">
                  ACTIVATED
                </p>
                <p className="text-[32px] font-medium text-white">DataGaze WAF</p>
                <p className="font-medium text-[14px] text-white">
                  available 500 licenses
                </p>
              </div>
              <img
                className="w-[40px] h-[40px]"
                src="../../../public/logo/waf.png"
                alt="logo"
              />
            </div>
            <div>
              <div className="flex flex-col items-center w-full mt-10">
                <div className="flex justify-between w-[350px] text-white text-sm mb-2">
                  <span>0</span>
                  <span>250</span>
                  <span>500</span>
                </div>
                <div className="relative w-[350px] h-[40px] flex items-center">
                  <div className="absolute w-full h-[8px]  rounded-full"></div>

                  <div className="flex justify-between w-full px-1">
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                    <div className="w-[12px] h-[32px] bg-white rounded"></div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-[20px] h-[40px] bg-white rounded"></div>
                </div>
              </div>
              <p className="font-medium text-[12px] text-white mt-6 flex items-center gap-2">
                {" "}
                <span className="bg-white w-[8px] h-[8px] rounded-[50%]"></span>
                RUNNING ON 238 COMPUTERS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
