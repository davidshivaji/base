import React, { useState, useEffect, useCallback } from "react"
import { withRouter, Redirect } from "react-router"
import { app, database } from "../firebase"
import firebase from 'firebase'
import 'firebase/auth'
// import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore"
// import { getAuth, signOut, createUserWithEmailAndPassword, sendEmailVerification,
//          signInWithPopup, GoogleAuthProvider
//  } from "firebase/auth"
// import './App.css'

const SignUp = ({ history }) => {
  const [error, seterror] = useState()
  const [userDoc, setUserDoc] = useState(null)
  const auth = firebase.auth()
  const currentUser = auth.currentUser
  const provider = new firebase.auth.GoogleAuthProvider()

  if (currentUser) {
    return <Redirect to="/" />
  }

  const GoogleSignUp = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
      console.log(result)
      // const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result)
      // const token = credential.accessToken
      const user = result.user
      console.log(user)
      // uid = result.uid
      // chuck an if statement with a where query here.
      // check if there is a firestore document with the same uid.



      database.users.where("userId", "==", user.uid)
      .get()
      .then((snap) => {
        console.log(snap)
        snap.forEach((doc) => {
          console.log(doc)
          setUserDoc(doc)
        })
      })


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
          // any other response will be an error object.
          console.error('catching on trying to create userdoc')
          console.log(error.code, error.message)
        })
      }

      history.push("/")

    }).catch((error) => {
      console.log(error)
      console.log('catching down here too')
      // const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error)
      // alert(error.message, error.email, credential)
    })
  }




  // async event says wait for this event to occur befor
  const handleSignUp = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements


    try {
      console.log('try block')
      await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function success(userData){
          console.log('created user', email.value)
          console.log(userData)
          userData.user.sendEmailVerification()
          // userData.user.sendEmailVerification()
          // signOut()
          database.users.add({
            userId: userData.user.uid,
            email: userData.user.email,
            tier: 'bronze'
          }).then(doc => console.log(doc.id)).catch(function failure(error){
            // any other response will be an error object.
            console.log(error.code, error.message)
          })
        })

      history.push("/")

    } catch (error) {
      // instead of alerting, you could put this below.
      alert(error)
      seterror(error)
    }
    // on the signup component, only when history changes, should this be run.
    //
  }

  return (
    <div className="logcard">
      <h1>Sign Up</h1>
      {error && <p>{error.message}</p>}
      <form onSubmit={handleSignUp}>
        <label>
          <input className="log-input" name="email" type="email" placeholder="Email" />
        </label>
        <label>
          <input className="log-input" name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={GoogleSignUp}>Sign Up with Google</button>
    </div>
  )
}

// this is what the callback is for.
// withRouter is a hook.
export default withRouter(SignUp)
