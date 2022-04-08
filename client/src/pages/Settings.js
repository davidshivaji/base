import React, { useState, useEffect } from 'react'
// import OptIn2FA from '../auth/optin2fa'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/Auth'
import firebase from 'firebase'
import 'firebase/auth'

// const { currentUser } = useAuth()
const auth = firebase.auth()
const currentUser = auth.currentUser


const Settings = () => {
    const [mfaEnabled, setMfaEnabled] = useState(false)

    useEffect(() => {
      if (currentUser) {
        if (currentUser.multiFactor.enrolledFactors.length > 0) {
          setMfaEnabled(true)
        }
      }
    }, [currentUser])


    console.log(currentUser)
    return (
        <div className="homecard">
        <p>toggle button</p>
        {mfaEnabled && <p>enabled</p>}
          <Link to="/optin2fa">Two Factor</Link>
        </div>
    )
}

export default Settings
