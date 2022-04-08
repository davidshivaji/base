import React, { useState, useEffect, useContext, useRef } from "react"
import { BrowserRouter as Router, Route, Switch, NavLink } from "react-router-dom"
import app from './firebase'
import { AuthProvider } from './auth/Auth'
import PrivateRoute from './auth/PrivateRoute'
import UnverifiedRoute from './auth/UnverifiedRoute'
import SilverRoute from './auth/SilverRoute'
import OptIn2FA from './auth/OptIn2FA'
import Account from './account/Account'
import Verify from './account/Verify'
import Upgrade from './account/Upgrade'
import NeedUpgrade from './account/NeedUpgrade'


import Home from './pages/Home'
import Settings from './pages/Settings'
import Pro from './pages/Pro'

import Navbar from './Navbar'
import Sidebar from './Sidebar/Sidebar'

import SignUp from './auth/SignUp'
import Login from './auth/Login'
import "./App.css"

const App = () => {
  // console.clear()
  const [sidebar, setSidebar] = useState(false)
  const [rightModal, setRightModal] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState()
  const [emailCheck, setEmailCheck] = useState('')
  const [dpCheck, setDPCheck] = useState('')
  const [verified, setVerified] = useState(null)
  const [verifyRunning, setVerifyRunning] = useState(false)
  const showRightModal = () => setRightModal(!rightModal)
  const showSidebar = () => setSidebar(!sidebar)

    return (
      <AuthProvider>
      <Router>
      <Navbar showSidebar={showSidebar}
              showRightModal={showRightModal}
              sidebaryn={sidebar}
              emailCheck={emailCheck} setEmailCheck={setEmailCheck}
              dpCheck={dpCheck} setDPCheck={setDPCheck}
              verified={verified} setVerified={setVerified}
              />
      <Sidebar setSidebar={setSidebar} sidebaryn={sidebar} />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/settings" component={Settings} />
            <PrivateRoute exact path="/optin2fa" component={OptIn2FA} />
            <PrivateRoute exact path="/account" component={Account} />
            <UnverifiedRoute exact path="/verify" component={() =>
                  <Verify setEmailCheck={setEmailCheck} setVerified={setVerified}/>}
                  />
            <PrivateRoute path="/upgrade" component={Upgrade} />
            <PrivateRoute path="/needupgrade" component={NeedUpgrade} />
            <SilverRoute exact path="/pro" component={Pro} />
        </Switch>
      </Router>
      </AuthProvider>
    )
}

export default App
