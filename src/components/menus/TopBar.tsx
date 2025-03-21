import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isFullScreen } from "~/utils";

interface TopBarItemProps {
  hideOnMobile?: boolean;
  forceHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const TopBarItem = React.forwardRef(
  (props: TopBarItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const hide = props.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex";
    const bg = props.forceHover
      ? "bg-gray-100/30 dark:bg-gray-400/40"
      : "hover:(bg-gray-100/30 dark:bg-gray-400/40)";

    return (
      <div
        ref={ref}
        className={`hstack space-x-1 h-6 px-1 cursor-default rounded ${hide} ${bg} ${
          props.className || ""
        }`}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
      >
        {props.children}
      </div>
    );
  }
);

interface TopBarState {
  showControlCenter: boolean;
  showAppleMenu: boolean;
}

const TopBar = (props: any) => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [state, setState] = useState<TopBarState>({
    showControlCenter: false,
    showAppleMenu: false
  });

  const useWindowSize = () => ({ winWidth: 1024, winHeight: 768 });

  const { winWidth, winHeight } = useWindowSize();
  const { toggleFullScreen } = useStore((state: any) => state);

  useEffect(() => {
    const isFull = isFullScreen();
    toggleFullScreen(isFull);
  }, [winWidth, winHeight, toggleFullScreen]);

  const toggleAppleMenu = useCallback(() => {
    console.log("Menu toggled");
    setState((prev) => ({ ...prev, showAppleMenu: !prev.showAppleMenu }));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token"); // Remove token
    setState((prev) => ({ ...prev, showAppleMenu: false })); // Close menu
    navigate("/"); // Navigate to root
  }, [navigate]);

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "License Limit Reached",
      message:
        "You’ve reached the maximum number of licenses. Upgrade to continue using all features.",
      icon: "i-bx:bx-error"
    },
    {
      id: 2,
      title: "Approaching License Limit",
      message:
        "You're nearing your license limit. Consider upgrading to avoid service interruptions.",
      icon: "i-bx:bx-upvote"
    }
  ];

  return (
    <div>
      <div
        className={`w-full h-[44px] px-2 fixed top-0 flex items-center justify-between  text-sm text-white bg-gray-700/10 backdrop-blur-2xl shadow transition`}
      >
        <div className="items-start flex">
          <div className="relative">
            <TopBarItem onClick={toggleAppleMenu} ref={appleBtnRef}>
              <img
                src="/logo/logo_data.svg"
                alt="Datagaze"
                className="w-[15px] h-[28px] cursor-pointer"
              />
            </TopBarItem>
            {state.showAppleMenu && (
              <div className="absolute top-[20px] left-0 w-[120px] bg-[#4474f8] text-white rounded-lg shadow-lg z-30">
                <button
                  onClick={handleLogout}
                  className="w-full h-[30px] bg-[black] text-red hover:text-[white] flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors duration-200 rounded-md text-sm font-medium"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <TopBarItem
            className="font-semibold px-2"
            onMouseEnter={() => {
              if (state.showAppleMenu) toggleAppleMenu();
            }}
          >
            <p className="font-normal cursor-pointer">DataGaze LTD 2025</p>
          </TopBarItem>
        </div>

        <div className="items-center flex flex-row justify-end space-x-5">
          <TopBarItem
            className="cursor-pointer"
            onClick={() => window.open("https://www.datagaze.uz/", "_blank")}
          >
            <span className="i-bx:bx-globe text-[17px]" />
            <span>Go to website</span>
          </TopBarItem>

          <TopBarItem
            className="cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="i-bx:bx-bell text-[17px]" />
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span className="bg-grey-500 text-white text-sm px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </TopBarItem>
          {showNotifications && (
            <div className="absolute top-12 right-5 w-80 space-y-3 z-30">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start space-x-3 bg-white/50 backdrop-blur-lg p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-white rounded-lg">
                    <span className={`${notif.icon} text-blue-500 text-2xl`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{notif.title}</p>
                    <p className="text-gray-700 text-sm">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <TopBarItem className="cursor-pointer">
            <span className="i-bx:bxs-smile text-[17px]" />
            <span>Jam</span>
            <span className="i-bx:bx-chevron-down text-[17px]" />
          </TopBarItem>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
