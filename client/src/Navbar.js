import React, { useState, useEffect, useContext, useRef,  } from "react"
import { BrowserRouter as Router, Link, NavLink } from 'react-router-dom'
import app, { db } from "./firebase"
//

import { useAuth, AuthProvider, AuthContext } from './auth/Auth'
import "./Navbar.css"
import "./App.css"

export const Navbar = (props) => {
    const [dP, setDP] = useState('')
    const [dperror, setdperror] = useState(false)

    const { tier } = useContext(AuthContext)
    const { currentUser } = useAuth()
    const [email, setEmail] = useState()

    const dropdownRef = React.createRef()

    useEffect(() => {
        if (currentUser) {
          console.log(currentUser.emailVerified)
          console.log(currentUser)
          setEmail(currentUser.email)
          props.setEmailCheck(currentUser.email)
          props.setDPCheck(currentUser.photoURL)
          setDP(currentUser.photoURL)
        }
    }, [currentUser])


    useEffect(() => {
    }, [props.emailCheck, props.dpCheck])

    useEffect(() => {
      if (currentUser) {
        props.setVerified(currentUser.emailVerified)
    }
    }, [currentUser])

    useEffect(() => {
    }, [props.sidebaryn])

      useEffect(() => {
        if (currentUser) {
          console.log(currentUser)
          setDP(currentUser.photoURL)
        }

      }, [])

    const dpError = () => {
        return (
          <i className="fas fa-user"></i>
        )
    }

    return (
        <div className="navwrap">
        <nav className="navigator">
      <NavLink to="/" exact className="homeinactive" exact activeClassName="homeactive">
        <div className="navbarlogo" id="navlogotext"><i className="fas fa-home"></i></div>
      </NavLink>
      <NavLink className="navlink" activeClassName="active" to="/app">App</NavLink>
        {currentUser ?
          <>
          <div className="navlink navright threedots" onClick={props.showSidebar}><i className={"fas fa-ellipsis-v " + (props.sidebaryn ? "dotshorizontal" : "dotsvertical")}></i></div>
          <NavLink className="navright navdp" activeClassName="navdpactive" to={currentUser.emailVerified ? "/account" : "/verify"}>
          <img src={dP} onError={e => e.target.src = "images/usericondefault.svg"} className="navbarprofilepic" />
          </NavLink>
          <Link to="/account" className="navemail navright">{props.emailCheck}</Link>
          {(props.verified == false) && <NavLink to="/verify" className="navlink navright" activeClassName="active">Verify</NavLink>}
          </>
                      :
          <>
          <NavLink to="/login" className="navlink navright" activeClassName="active">Login</NavLink>
          <NavLink to="/signup" className="navlink navright"activeClassName="active">Sign Up</NavLink>
          </>
        }


        {
          (currentUser && (tier === "silver")) &&

          <NavLink to="/pro" className="navlink" activeClassName="active">Pro</NavLink>


        }
        {
          (currentUser && (tier === "bronze")) &&

          <NavLink to="/upgrade" className="navlink" activeClassName="active">Upgrade</NavLink>


        }

        </nav>
        </div>
    )
}

export default Navbar
