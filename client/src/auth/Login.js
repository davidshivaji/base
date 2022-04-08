import React, { useState, useEffect, useRef, useContext } from "react"
import { Link } from 'react-router-dom'
import { withRouter, Redirect } from "react-router"
import { database } from "../firebase"

import firebase from 'firebase/app'
import 'firebase/auth'

import { AuthContext } from "./Auth.js"

const auth = firebase.auth()
const app = firebase.app()

const provider = new firebase.auth.GoogleAuthProvider()

const Login = ({ history }) => {
  const [userDoc, setUserDoc] = useState(null)
  const [OTPrequested, setOTPRequested] = useState(false)
  const [error, seterror] = useState()

  const loginemailRef = useRef()
  const loginpasswordRef = useRef()
  const loginCodeRef = useRef()

  const generateRecaptcha = () => {
  console.log('generating recaptcha')
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('2fa-captcha', {
    'size': 'invisible',
    'callback': (response) => {
      console.log('captcha solved!')
    },
    'expired-callback': () => {
      console.log('expired callback')
    }
  }, app)

  }


  const handleLogin = async (e) => {
      e.preventDefault()

      const email = loginemailRef.current.value
      const password = loginpasswordRef.current.value

      auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
          history.push('/')
        }
      ).catch(async (err) => {
        if (err.code === 'auth/multi-factor-auth-required') {
          await generateRecaptcha()
          console.log(err.constructor.name)
          console.log('caught error')
          window.resolver = err.resolver
          console.log(Object.getOwnPropertyNames(err.resolver))
          console.log(err.resolver)

          const phoneOpts = {
            multiFactorHint: window.resolver.hints[0],
            session: window.resolver.session
          }

          const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

          window.verificationId = phoneAuthProvider.verifyPhoneNumber(
            phoneOpts,
            window.recaptchaVerifier
          )
          alert('sms sent')
          setOTPRequested(true)
        }
      })

  }

  const verifyLogin = async (e) => {

      e.preventDefault()
      console.log(window.verificationId)
      const code = loginCodeRef.current.value
      const cred = new firebase.auth.PhoneAuthProvider.credential(
        // this isn't being defined. // not a valid string fsr.
      window.verificationId.i,
      code
      )

      const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
        cred
      )

      const credential = await window.resolver.resolveSignIn(multiFactorAssertion)

      console.log(credential)

      alert('logged in!')
      setOTPRequested(false)

  }

  const GoogleSignIn = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
      // const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result)
      // const token = credential.accessToken
      const user = result.user
      console.log(result)

      // getting the userDoc.
      database.users.where("userId", "==", result.user.uid).get()
      .then((snap) => {
        snap.forEach((doc) => {
          setUserDoc(doc)
        })
      })


      // firebase 9
      // const q = query(usersRef, where("userId", "==", result.user.uid))
      // onSnapshot(q, (snapshot) => {
      //   snapshot.docs.forEach((doc) => {
      //     setUserDoc(doc)
      //   })
      // })

      if (!userDoc) {
        database.users.add({
          userId: result.user.uid,
          email: result.user.email,
          tier: 'bronze'
        }).then(doc => console.log(doc.id)).catch(function failure(error){
          console.log(error.code, error.message)
        })
      }


      // if (!userDoc) {
      //   addDoc(collection(db, "users"), {
      //     userId: result.user.uid,
      //     email: result.user.email,
      //     tier: 'bronze'
      //   }).then(doc => console.log(doc.id)).catch(function failure(error){
      //     // any other response will be an error object.
      //     console.log(error.code, error.message)
      //   })
      // }

      history.push("/")

    }).catch(async (err) => {
      // const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error)
      // alert(error.message, error.email, credential)
      if (err.code === 'auth/multi-factor-auth-required') {
        await generateRecaptcha()
        console.log(err.constructor.name)
        console.log('caught error')
        window.resolver = err.resolver
        console.log(Object.getOwnPropertyNames(err.resolver))
        console.log(err.resolver)

        const phoneOpts = {
          multiFactorHint: window.resolver.hints[0],
          session: window.resolver.session
        }

        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();

        window.verificationId = phoneAuthProvider.verifyPhoneNumber(
          phoneOpts,
          window.recaptchaVerifier
        )
        alert('sms sent')
        setOTPRequested(true)
      } else {
       alert(err.message)
     }
    })
  }

  const { currentUser } = useContext(AuthContext)

  if (currentUser) {
    return <Redirect to="/" />
  }

  return (
    <div className="logcard">
    <div id="2fa-captcha"></div>
      <h1>Login</h1>
      {error && <p>{error.message}</p>}
      <form onSubmit={handleLogin}>
        <label>
          <input name="email" ref={loginemailRef} type="email" placeholder="Email"/>
        </label>
        <label>
          <input name="password" ref={loginpasswordRef} type="password" placeholder="Password" />
        </label>
        <button className="smallbutton" type="submit">Log In</button>
        </form>
        {OTPrequested &&
          <form onSubmit={verifyLogin}>
          <input ref={loginCodeRef} placeholder="Enter verification code"/>
          <button type="submit">Submit</button>
          </form>
        }
        <div>
        <span className="text-left">Forgot Password?</span><Link to="/signup" className="text-right">Register</Link>
        </div>
      <button onClick={GoogleSignIn}>Sign In With Google</button>
    </div>
  )
}

export default withRouter(Login)
