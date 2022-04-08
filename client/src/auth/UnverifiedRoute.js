import React, { useContext } from "react"

import { Route, Redirect } from "react-router-dom"
import { useAuth } from "./Auth"

const UnverifiedRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useAuth()


  if (currentUser && !currentUser.emailVerified) {
    return (
      <Route {...rest} render={routeProps => <RouteComponent {...routeProps} /> } />
    )
  } else if (currentUser && currentUser.emailVerified) {
    return (
      <Redirect to={"/already-verified"} />
    )
    // no currentUser object.
  } else {
    return (
      <Redirect to={"/login"} />
    )
  }




}

export default UnverifiedRoute
