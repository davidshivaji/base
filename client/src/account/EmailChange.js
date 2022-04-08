import React, { useState, useEffect, useRef } from 'react'
import { withRouter, Redirect} from 'react-router'
import app, { database, storage } from '../firebase'
import { useAuth } from '../auth/Auth'
import firebase from "firebase"
import 'firebase/auth'

const EmailChange = ({ history, setEmailCheck }) => {
  const auth = firebase.auth()
  const user = auth.currentUser
  console.log(user)
  const { currentUser } = useAuth()
  const [statenewemail, setstatenewemail] = useState(null)
  const [statepass, setstatepass] = useState(null)

  const [docId, setDocId] = useState()

  const newEmailRef = useRef()

  useEffect(() => {
    console.log(currentUser.email)
  }, [])

  // DELETE THIS FOR PRODUCTION
  // you don't want to include login email for each user in firestore.

  useEffect(() => {
    if (user) {
      database.users.where("userId", "==", user.uid)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          setDocId(doc.id)
      })
    })
  }}, [user])



  const handleNewEmailChange = (e) => {
    setstatenewemail(e.target.value)
  }

  const handlePassChange = (e) => {
    setstatepass(e.target.value)
  }

  // reauth function, call this on anything. a submit button.
  // only one input.
  // const reauthenticate = (currentPassword) => {
  //     console.log('reauthenticating.')
  //     var cred = firebase.auth.EmailAuthProvider.credential(
  //     currentUser.email, currentPassword)
  //     return currentUser.reauthenticateWithCredential(cred)
  // }








  // fuck. i should only do this on confirmation though.
  // only when email verification link is clicked. shouldn't do it anyway.
  // only when verified == true.

  const changeEmail = async (e) => {
    console.log(history.location)
    e.preventDefault()
    console.log('reauthenticating.')

  function runWaitThenPushToVerify() {
    setTimeout(function () {
      history.push('/verify')
    }, 5000)
  }

    const RedirectToVerify = async () => {
      await currentUser.reload().then(() => {
        // it's fine if these ones are wrong.
        console.log('this is the currentUser.email', currentUser.email)
        console.log('the currentUser is verified', currentUser.emailVerified)
        runWaitThenPushToVerify()
      })
      // this shows that it hasn't actually reloaded.

      // then
    }

    const credential = firebase.auth.EmailAuthProvider.credential(user.email, statepass)

    try {

    await currentUser.reauthenticateWithCredential(credential).then(() => {
      currentUser.updateEmail(newEmailRef.current.value)
      // success function
      database.users.doc(docId).update({
        email: newEmailRef.current.value
      })
      console.log('email changed')
      currentUser.reload()
      // this still has the old email.
      console.log(`reloaded user ${currentUser.email}, verified = ${currentUser.emailVerified}`)
      currentUser.sendEmailVerification()
      console.log(`sent email verification to ${currentUser.email}`)

      // RedirectToVerify()
      // return <Redirect to="/verify" />
      // history.push("/verify")
      // console.log('redirecting to verify')

      // works fine. just do error handling.
    }).then(() => RedirectToVerify())

    .catch((error) => {
    alert(error.message)
    console.log('error occured', error.message)
  }
)
  } catch (error) {
    console.log(error)
  }
  }

  // pass update definitely works, but it's not clean.
  // const changePassword = (e, currentPassword, newPassword) => {
  //   e.preventDefault()
  //   console.log('changing password')
  //     reauthenticate(currentPassword).then(() => {
  //     currentUser.updatePassword(newPassword).then(() => {
  //     console.log("Password updated!")
  // }).catch((error) => { console.log(error) })
  // }).catch((error) => { console.log(error) })
  // }

  return (
  <div className="emaildiv">
  <p>Change Email Address</p>
    <form action="" onSubmit={changeEmail}>
      <input type="email" ref={newEmailRef} name="newemail" onChange={handleNewEmailChange} value={statenewemail} placeholder={user.email}/>
      <input type="password" name="password" onChange={handlePassChange} value={statepass} placeholder="password"/>
      <button type="submit">submit</button>
    </form>
  </div>
  )

}

export default withRouter(EmailChange)
