import { FC, useState } from "react";
import '../css/sidebar.css'; 
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'


const menuItems = [
  {
    name: "Home",
    icon: "home",
  },
  {
    name: "Upload Moment",
    icon: "add_box",
  },
  {
    name: "Profile",
    icon: "account_circle",
  },
  {
    name: "Search",
    icon: "search",
  },
  {
    name: "Log Out",
    icon: "exit_to_app",
  },
];

const Icon = ({ icon }: { icon: string }) => (
  <span className="material-symbols-outlined">{icon}</span>
);

const tabs = ["menu", "settings"];

type NavProps = {
  activeTab: number;
  onTabClicked: (tab: number) => void;
};

const Nav: FC<NavProps> = ({ activeTab, onTabClicked }) => (
  <header className="tabs">
    {tabs.map((tab, index) => (
      <button
        key={tab}
        type="button"
        onClick={() => onTabClicked(index)}
        className={`${activeTab === index ? "active" : ""}`}
      >
        <Icon icon={tab} />
      </button>
    ))}
    <div
      className="underline"
      style={{
        translate: `${activeTab * 100}% 0`,
      }}
    />
  </header>
);

type ButtonProps = {
  name: string;
  icon?: string;
};

const NavButton: FC<ButtonProps & { onClick: () => void }> = ({ name, icon, onClick }) => (
  <button type="button" onClick={onClick}>
    {icon && <Icon icon={icon} />}
    <span>{name}</span>
  </button>
);

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();
  let{user, logoutUser} = useContext(AuthContext);

  const handleTabClicked = (index: number) => setActiveTab(index);

  const handleButtonClick = (name: string) => {
    if (name === "Upload Moment") {
      navigate('/postupload')
    }
    else if (name === "Log Out") {
      logoutUser();
    }
    else if (name === "Profile") {
      navigate(`/userprofile/${user.id}`)
    }
    else if (name === "Search") {
      navigate('/search')
    }
    else{
      navigate('/')
    }
    // Add more conditions here for other button actions
  };


  return (
    <aside className="sidebar">
      <div>
        <Nav activeTab={activeTab} onTabClicked={handleTabClicked} />

        <ReactCarousel
          className="react-carousel"
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          swipeable={true}
          emulateTouch={true}
          selectedItem={activeTab}
          onChange={handleTabClicked}
        >
          <div className="menu-items">
            {menuItems.map((item) => (
              <NavButton key={item.name} name={item.name} icon={item.icon} onClick={() => handleButtonClick(item.name)}/>
            ))}
          </div>
          {/* <div>
            <form>
              <div className="textbox">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <input placeholder="Name" type="text" required />
              </div>
              <div className="textbox">
                <span className="material-symbols-outlined">lock</span>
                <input placeholder="Password" type="password" required />
              </div>
              <div className="textbox">
                <span className="material-symbols-outlined">email</span>
                <input placeholder="Email" type="text" required />
              </div>
            </form>
          </div> */}
          <div>
            <form>
              <div className="row">
                <div className="switch-label">Dark Mode</div>
                <span className="switch">
                  <input id="switch-round" type="checkbox" />
                  <label htmlFor="switch-round"></label>
                </span>
              </div>
              <div className="row">
                <div className="switch-label">Accessibility Mode</div>
                <span className="switch">
                  <input id="switch-round" type="checkbox" />
                  <label htmlFor="switch-round"></label>
                </span>
              </div>
              <div className="row">
                <div className="switch-label">Quirks Mode</div>
                <span className="switch">
                  <input id="switch-round" type="checkbox" />
                  <label htmlFor="switch-round"></label>
                </span>
              </div>
            </form>
          </div>
        </ReactCarousel>
      </div>
    </aside>
  );
};