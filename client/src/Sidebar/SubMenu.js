import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 30px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    /* border-left: 4px solid #632ce4; */
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 25px;
`;

// if subnav=true, then inside the div, run item.iconOpened, otherwise run item.subNav.
// if that statment equates truthily, throw in item.iconClosed.
// otherwise return null.

// item = messages
// item.iconOpened = up

// otherwise return the item's subnav property. which does nothing.
// which is just an array. idk how.

// it's just nested. only if subnav = false, run the logic:
  // if item contains a subnav.
// if item.subNav = undefined or null, none of this line gets run.

// if subnav is in fact false, run the logic, if item.subNav exists: show the closed icon,
// otherwise return null.
// { item.subNav && subnav ? item.iconOpened : (item.subNav ? item.iconClosed : null )}

// having item.subNav twice here is redundant.


const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>

      <Link className="sidebarlink" to={item.path} onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <span>{item.title}</span>
        </div>
        <div>
          { item.subNav && subnav ? item.iconOpened : true ? item.iconClosed : null }
        </div>
      </Link>

      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <Link className="dropdown" to={item.path} key={index}>
              {item.icon}
              <span className="sidebarlabel">{item.title}</span>
            </Link>
          );
        })}

    </>
  );
};

export default SubMenu;
