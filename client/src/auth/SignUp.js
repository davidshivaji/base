import React, { useState, useEffect, useCallback } from "react"
import { withRouter, Redirect } from "react-router"
import { app, database } from "../firebase"
import firebase from 'firebase'
import 'firebase/auth'

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
      const user = result.user


      database.users.where("userId", "==", user.uid)
      .get()
      .then((snap) => {
        console.log(snap)
        snap.forEach((doc) => {
          console.log(doc)
          setUserDoc(doc)
        })
      })


      if (!userDoc) {
        database.users.add({
          userId: result.user.uid,
          email: result.user.email,
          tier: 'bronze'
        }).then(doc => console.log(doc.id)).catch(function failure(error){
          console.log(error.code, error.message)
        })
      }

      history.push("/")

    }).catch((error) => {
      console.log(error)
    })
  }



  const handleSignUp = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements


    try {
      await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function success(userData){
          userData.user.sendEmailVerification()

          database.users.add({
            userId: userData.user.uid,
            email: userData.user.email,
            tier: 'bronze'
          }).then(doc => console.log(doc.id)).catch(function failure(error){
            console.log(error.code, error.message)
          })
        })

      history.push("/")

    } catch (error) {
      alert(error)
      seterror(error)
    }

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

export default withRouter(SignUp)
