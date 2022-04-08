import React, { useState, useEffect, useContext, createContext } from "react"
import firebase from 'firebase'
import app from "../firebase"
import Loading from '../Loading'

export const AuthPage = () => {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
    } )
  }, [currentUser])

  const provider = new firebase.auth.GoogleAuthProvider()
  const authWithGoogle = () => {
    firebase.auth().signInWithPopup(provider)
  }
  return <button className="loginbutton" onClick={authWithGoogle}>Sign in with Google</button>
}

export const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null)

  const [tier, setTier] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      app.firestore().collection("users")
      .where("userId", "==", currentUser.uid)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          setTier(doc.data().tier)
        })
      })
    }
  }, [currentUser])


  if(loading){
    return <Loading />
}
  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        tier: tier
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
