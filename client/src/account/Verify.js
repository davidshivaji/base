import React, { useEffect } from 'react'
import { useAuth } from '../auth/Auth'
import { Redirect, withRouter } from 'react-router'
import firebase from 'firebase'
import 'firebase/auth'
import EmailChange from "./EmailChange"


export const Verify = ({ history, setEmailCheck, setVerified }) => {
  const { currentUser } = useAuth()

  const sendVerifyEmail = async () => {
    console.log('sending verification email')
    // currentUser.sendEmailVerification().then(data => console.log(data))
    // await firebase.auth.sendEmailVerification(currentUser)
    await currentUser.sendEmailVerification()
  }

  // it's a componentWillUnmount. a useEffect that will destroy the component
  // it exists in
  // you need one prop.
  // it's the most pointless thing to write though. they can just refresh the page.
  // what about native though? yeah it needs to constantly check and update auto.

  const RedirectToVerify = async () => {
    await currentUser.reload()
    // then
    console.log(currentUser.email)
  }

  useEffect(() => {
    // console.log('verification component.')
    currentUser.reload()

    if (!currentUser.emailVerified) {

    }
    const intervalID = setInterval(() => {
      console.log('checking for verification')
      console.log(currentUser.email, currentUser.emailVerified)
      setEmailCheck(currentUser.email)
      setVerified(currentUser.emailVerified)
      currentUser.reload()
      // also clear the interval if verify route isn't being used.
      if (currentUser.emailVerified) {
        history.push('/already-verified')
        // window.location.reload(true)
        return clearInterval(intervalID)
        // return <Redirect to="/already-verified" />
      }

      if (window.location.pathname != "/verify") {
        return clearInterval(intervalID)
      }
    }, 3000)
  }, [currentUser.emailVerified])
  // ^^ this needs to unmount.

    return (
        <div className="homecard">
        <h3>✅  Verification email sent</h3>
          <button onClick={sendVerifyEmail}>Click to resend verification email</button>
          <p>determine whether sent or not. possible timer.</p>
          <p>add a useEffect that checks whether email has been updated.</p>
          <p>or</p>
          <EmailChange />

        </div>
    )
}

export default withRouter(Verify)
