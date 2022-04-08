import React, { useEffect, useContext } from "react"

import { Route, Redirect } from "react-router-dom"
import { useAuth } from "./Auth"
import firebase from 'firebase'
import 'firebase/auth'
import Loading from '../Loading'

const SilverRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser, tier } = useAuth()
  const auth = firebase.auth()
  const user = auth.currentUser

  function RenderSilver() {
    switch (tier) {
      case undefined : return <Loading />
      case "silver" : return <Route {...rest} render={routeProps => <RouteComponent {...routeProps} /> } />
      case "bronze" : return <Redirect to={"/upgrade"} />
      default : return <div>default</div>
    }
  }

  return (
    <div>{RenderSilver()}</div>
  )
  // return <div>
}


export default SilverRoute
