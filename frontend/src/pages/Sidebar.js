import React, { useState, useContext } from 'react';
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

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
    name: "Edit Profile",
    icon: "edit",
  },
  {
    name: "Explore",
    icon: "explore",
  },
  {
    name: "Search",
    icon: "search",
  },
  {
    name: "Code",
    icon: "gavel",
  },
  {
    name: "Log Out",
    icon: "exit_to_app",
  },
];

const Icon = ({ icon }) => (
  <span className="material-symbols-outlined">{icon}</span>
);

const tabs = ["menu"];

const Nav = ({ activeTab, onTabClicked }) => (
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

const NavButton = ({ name, icon, onClick }) => (
  <button type="button" onClick={onClick}>
    {icon && <Icon icon={icon} />}
    <span>{name}</span>
  </button>
);

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  let { user, logoutUser } = useContext(AuthContext);

  const handleTabClicked = (index) => setActiveTab(index);

  const handleButtonClick = (name) => {
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
    else if (name === "Edit Profile") {
      navigate(`/editprofile/${user.id}`)
    }
    else if (name === "Explore") {
      navigate(`/explore`)
    }
    else if (name === "Code") {
      navigate(`/code`)
    }
    else{
      navigate('/')
    }
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
              <div className="menu-item" key={item.name}>
                <NavButton key={item.name} name={item.name} icon={item.icon} onClick={() => handleButtonClick(item.name)} />
              </div>
            ))}
          </div>
          <div>
          </div>
        </ReactCarousel>
      </div>
    <div className="logo-container"> {/* Add this div */}
      <img src={`http://localhost:8000${'/media/images/logo.jpeg' || '/media/images/default_user.g'}`} alt="logo" className="logo" />
    </div>
    </aside>
  );
};
