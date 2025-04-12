import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { FaBars } from "react-icons/fa"; // Added hamburger icon
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FaPaintBrush, FaCogs } from "react-icons/fa";  // Design icons
import { GiMegaphone } from "react-icons/gi";  // Digital marketing icon
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { links } from "../Data/dummy";
import { useStateContext } from "../Contexts/ContextProvider";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu } = useStateContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => setActiveMenu(false);

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const SidebarContent = () => (
    <div className="h-screen overflow-auto pb-10">
      <div className="flex justify-between items-center">
        <Link 
          to="/" 
          onClick={isMobile ? handleClose : undefined}
          className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
        >
          <SiShopware /> <span>Artisticify</span>
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={handleClose}
            style={{ color: currentColor }}
            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block mr-2"
          >
            <MdOutlineCancel />
          </button>
        )}
      </div>

      <div className="mt-10">
        {links.map((item) => (
          <div key={item.title}>
            <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
              {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink
                to={`/${link.name}`}
                key={link.name}
                onClick={isMobile ? handleClose : undefined}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                {link.icon}
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-72 fixed sidebar bg-white dark:bg-secondary-dark-bg">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Offcanvas */}
      {isMobile && (
        <Offcanvas 
          show={activeMenu} 
          onHide={handleClose}
          placement="start"
          style={{ width: '272px' }}
          className="bg-white dark:bg-secondary-dark-bg"
        >
          <Offcanvas.Body className="p-0">
            <SidebarContent />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};

export default Sidebar;
