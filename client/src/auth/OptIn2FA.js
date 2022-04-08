import React, { useState, useEffect, useRef } from 'react'
import firebase from 'firebase'
import 'firebase/auth'

const auth = firebase.auth()
const app = firebase.app()

const OptIn2FA = () => {

    const user = auth.currentUser
    console.log(user)

    const [OTPRequested, setOTPRequested] = useState(false)
    const [reauthor, setReauthor] = useState(false)
    const [enrollable, setEnrollable] = useState(null)
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
    const [googleauth, setGoogleauth] = useState(true)

    const enrollpassRef = useRef()
    const enrolltelRef = useRef()
    const enrollCodeRef = useRef()

    auth.onAuthStateChanged((user) => {
    if (user) {
      return
    } else {
      return
    }
  })

  const determineMFAStatus = async () => {
    // why isn't this function running?
    const user = auth.currentUser
    const session = await user.multiFactor.getSession()
    const mfaProp = await user.multiFactor
    // await console.log(session)
    await console.log(mfaProp)

    if (mfaProp.enrolledFactors.length >= 1) {
      // await generateRecaptcha()
      console.log('yes already enrolled')
      setAlreadyEnrolled(true)
      setEnrollable(false)
    }
    return (mfaProp.enrolledFactors.length >= 1)
  }

  useEffect(() => {
    determineMFAStatus()
    if (user.providerData[0].providerId != "google.com") {
      setGoogleauth(false)
    }
  }, [])

  useEffect( async () => {
    const user = auth.currentUser
    const session = await user.multiFactor.getSession()
    const mfaProp = await user.multiFactor
    if (mfaProp.enrolledFactors.length < 1) {
      // await generateRecaptcha()
      console.log('yes already enrolled')
      setAlreadyEnrolled(true)
      setEnrollable(false)
    }
  }, [])


    const generateRecaptcha = () => {
    console.log('fuck')
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('2fa-captcha', {
      'size': 'invisible',
      'callback': (response) => {
        //
        console.log('captcha solved!')
      },
      'expired-callback': () => {
        console.log('expired callback')
      }
    }, app)

  }

  const Reauthenticator = async (e) => {
    e.preventDefault()
    if (user.providerData[0].providerId == "google.com") {
      const provider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(provider)
      // firebase.auth.signInWithPopup(provider)
      console.log('yep')
    } else {
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, enrollpassRef.current.value)
      await user.reauthenticateWithCredential(credential)
      console.log('reauthenticated')
    }
    openEnroll(e)
  }


  const openEnroll = async (e) => {
  e.preventDefault()
  // why isn't this function running?
  const user = auth.currentUser
  const session = await user.multiFactor.getSession()
  const mfaProp = await user.multiFactor
  // await console.log(session)
  await console.log(mfaProp)

  if (mfaProp.enrolledFactors.length < 1) {
    // await generateRecaptcha()
    setEnrollable(true)
  } else {
    setEnrollable(false)
    alert('already enrolled in 2fa')
  }

}

const handleEnroll = async (e) => {
    e.preventDefault()
    await generateRecaptcha()
    const user = auth.currentUser

    const phoneNumber = enrolltelRef.current.value

    const session = await user.multiFactor.getSession()

    const phoneOpts = {
      phoneNumber,
      session
    }

    const phoneAuthProvider = new firebase.auth.PhoneAuthProvider()

    window.verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneOpts,
      window.recaptchaVerifier
    )

  setOTPRequested(true)

  }

  const handleVerifyEnroll = async (e) => {
    e.preventDefault()
    const code = enrollCodeRef.current.value
    const cred = new firebase.auth.PhoneAuthProvider.credential(
      window.verificationId,
      code
    )
    const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(
      cred
    )
    const user = auth.currentUser
    await user.multiFactor.enroll(multiFactorAssertion, 'phoneNumber')
    alert('enrolled in 2FA')
    setEnrollable(false)
  }




    // ensure that email is verified.
    return (
        <div className="homecard">
            <h1>Two Factor Authentication</h1>
            <div id="2fa-captcha"></div>
            <p>{auth.currentUser.email}</p>

            {alreadyEnrolled ? <p><i className="fas fa-check"></i>  Already enrolled in 2FA</p> : <button onClick={openEnroll}>Click to enroll in 2FA</button>}

      {reauthor &&
        <form onSubmit={Reauthenticator}>
      {!googleauth &&
        <>
        <input ref={enrollpassRef} type="password" placeholder="Password" />
        </>
      }
      <button type="submit">Submit</button>
        </form>
      }

      {enrollable &&
      <>
      <form id="enroll" onSubmit={(e) => handleEnroll(e)}>
      <h3>handleEnroll</h3>
      <input ref={enrolltelRef} type="tel" placeholder="Phone Number"/>
      <button type="submit">Enroll</button>
      </form>


      {
      OTPRequested && <form onSubmit={handleVerifyEnroll}>
      <h3>handleVerifyEnroll</h3>
      <input ref={enrollCodeRef} type="text" placeholder="Verification Code"/>
      <button type="submit">Verify</button>
      </form>
    }
      </>
    }
        </div>
    )
}

export default OptIn2FA
