import React, { useState, useRef } from 'react'
import app from '../firebase'
import firebase from 'firebase'
import { useAuth } from '../auth/Auth'
import 'firebase/auth'


const PasswordChange = () => {
  const auth = firebase.auth()
  const user = auth.currentUser
  const { currentUser } = useAuth()

  // remove this state storage crap

  const [statepass, setstatepass] = useState(null)
  const [stateconfirmpass, setstateconfirmpass] = useState(null)
  const [statenewpass, setstatenewpass] = useState(null)

  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const newPasswordRef = useRef()

  const handlePassChange = (e) => {
    setstatepass(e.target.value)
  }

  const handleConfirmPassChange = (e) => {
    setstateconfirmpass(e.target.value)
  }

  const handleNewPassChange = (e) => {
    setstatenewpass(e.target.value)
  }

  const changePassword = async (e, currentPassword, newPassword) => {
    e.preventDefault()
    console.log('reauthenticating.')

    const credential = firebase.auth.EmailAuthProvider.credential(user.email, statepass)

    // add try catch


    await currentUser.reauthenticateWithCredential(credential).then(() => {
      currentUser.updatePassword(newPasswordRef.current.value)
      // success function
      console.log('password changed')
      // works fine. just do error handling.
    })
  }

  return (
  <div className="pwdiv">
  <p>Change Password</p>
    <form action="" onSubmit={(e) => changePassword(e, statepass, statenewpass)}>
      <input ref={passwordRef} type="password" name="currentpassword" onChange={handlePassChange} value={statepass} placeholder="currentpassword"/>
      <input ref={confirmPasswordRef} type="password" name="confirmcurrentpassword" onChange={handleConfirmPassChange} value={stateconfirmpass} placeholder="confirmpass" disabled={true} />
      <p>add onblur to this & run reauth</p>

      <input ref={newPasswordRef} type="password" name="newpassword" value={statenewpass} onChange={handleNewPassChange} value={statenewpass} placeholder="newpassword"/>
      <button type="submit">submit</button>
    </form>
  </div>
  )

}

export default PasswordChange
