import React, { useState, useContext, useEffect } from 'react';
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Visibility } from '@mui/icons-material';



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







export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(-1000);
  const navigate = useNavigate();
  let { authTokens, user, logoutUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true)


  const [isVerified, setIsVerified] = useState(false);


  const toggleVisibility = async () => {
    const response = await fetch('http://localhost:8000/api/toggle-visibility/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
        }
    });


    const data = await response.json();
    console.log(data)
    if (response.status === 200) {
        toast.success("Visibility toggled. Current state:", data.is_private ? "Private" : "Public");
    } else {
        toast.error("Failed to toggle visibility. Please try again later.");
    }
};



  const verifyDetails = async (e, email, password) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const response = await fetch('http://localhost:8000/api/verify-details/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authTokens.access}`,
        },
        body: formData
    });


    const data = await response.json();
    console.log(data)
    if (response.status === 200) {
        setIsFormVisible(false);
        setIsVerified(true);
        toast.success("Verifed!");

    } else {
        // Handle other errors (like network or server errors)
        toast.error("Failed to verify details. Please enter the correct credientals.");
    }
  };

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
          {isFormVisible && (
          <form className='settingsForm'>
              <div className="textbox">
                <span className="material-symbols-outlined">email</span>
                <input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="textbox">
                <span className="material-symbols-outlined">lock</span>
                <input placeholder="Password"  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <button onClick={(e) => verifyDetails(e, email, password)}>Verify</button>
              </div>
            </form>
          )}
            {
                isVerified &&
                <>
                    <NavButton className= 'test' name={'Switch Visibility'} icon={"lock"} onClick={() => toggleVisibility()} />
                    <button className='test'>Delete Account</button>
                </>
            }
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
