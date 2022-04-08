import React, { useEffect } from 'react';
import { Link } from 'react-router'
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import './Sidebar.css'

import firebase from 'firebase'

const auth = firebase.auth()

const Sidebar = (props) => {
  const { setSidebar, sidebaryn, history } = props

  useEffect(() => {
    // console.log(sidebaryn)
  }, [sidebaryn])

  const SidebarLogout = () => {
    console.log('logging out', sidebaryn)
    setSidebar(false)
    auth.signOut()
    history.push('/login')
  }

  return (
    <div className="sidebarrier">
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav sidebar={sidebaryn} className={sidebaryn ? 'sidebarnav' : 'sidebarnavclosed'}>
          <div className="sidewrap">
            {SidebarData.map((item, index) => {
              return <SubMenu className="submenu" item={item} key={index} />;
            })}
            <div to="/" className="sidebarlink" onClick={SidebarLogout}>Log Out</div>
          </div>
        </nav>
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
