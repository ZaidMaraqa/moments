import React, { useState, useContext, useEffect } from 'react';
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { Button } from 'react-bootstrap';

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

const tabs = ["menu", "lock", "settings"];

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

const [isVerified, setIsVerified] = useState(false);


const verifyDetails = async (name, password) => {
  const response = await fetch('http://localhost:8000/api/verify-details/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          // Add your authorization header here if required.
      },
      body: JSON.stringify({ name, password })
  });

  if (response.status === 200) {
      const data = await response.json();
      if (data.is_verified) {
          setIsVerified(true);
      } else {
          // Handle verification failure
          console.log("Verification failed");
          setIsVerified(false);
      }
  } else {
      // Handle other errors (like network or server errors)
      console.error("Failed to verify details. Please try again later.");
  }
};





export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(-1000);
  const navigate = useNavigate();
  let { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab(0);
    }, 1); // Adjust timing as necessary
    return () => clearTimeout(timer); // Cleanup
  }, []);
  


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
          <form className='settingsForm'>
              <div className="textbox">
                <span className="material-symbols-outlined">email</span>
                <input placeholder="Email" type="text" required />
              </div>
              <div className="textbox">
                <span className="material-symbols-outlined">lock</span>
                <input placeholder="Password" type="password" required />
              </div>
              <div>
                <Button onClick={handleButtonClick}>Submit</Button>
              </div>
            </form>
          </div>
          <div>
          <form className='settingsForm'>
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
    <div className="logo-container"> 
      <img src={`http://localhost:8000${'/media/images/logo.jpeg' || '/media/images/default_user.g'}`}  alt="" className="logo" />
    </div>
    </aside>
  );
};
