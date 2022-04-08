import React, { useState, useEffect } from 'react'
import { useAuth } from "../auth/Auth"
import app, { db,  database } from '../firebase'
import { PayPalButton } from "react-paypal-button-v2"
import firebase from 'firebase'
import 'firebase/auth'

require('dotenv').config()

export const Upgrade = () => {
  const { currentUser, tier } = useAuth()
  console.log(currentUser, tier)
  const [amount, setAmount] = useState(0.03)
  const [docId, setDocId] = useState(null)
  const [message, setMessage] = useState(null)
  const [cheatcodesOn, setCheatCodesOn] = useState(true)

  // this is the piece just to get the docId of the current user.


  useEffect(() => {
    database.users.where("userId", "==", currentUser.uid)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        setDocId(doc.id)
      })
    })
  }, [])

  useEffect(() => {
    console.log('just re-render')
  }, [cheatcodesOn])

  function UpSilverComponent(data) {
    return (
      <div className="upgradecard">
      Tier 2 Account
      <br/>
      gives the user access to the pro component,
      and displays it in the navbar.
      <br/>
      <br/>

      {cheatcodesOn &&
        <button onClick={SilverSubmit}>Click for free upgrade to Silver</button>
      }
      <br/>
      <br/>
      <br/>
      <br/>
      <div className="amounter">{amount}</div>
      <div
      className="paybutton"
      >
      <PayPalButton
      amount={amount}
      createSubscription={(data, actions) => {
        console.log(data, actions)
        return actions.subscription.create({
          'plan_id': process.env.REACT_APP_PAYPAL_SUBSCRIPTION_PLAN_ID,
        })
      }}
      onApprove={(details, data) => {
        // alert("Transaction completed by " + details.payer.name.given_name);
        console.log('supposedly submitting')
        SilverSubmit()
        // window.location.reload()
        return fetch("/paypal-transaction-complete", {
          method: "post",
          body: JSON.stringify({
            orderId: data.orderID
          })
        });
      }}
      options={{
        clientId: process.env.REACT_APP_PAYPAL_PRODUCTION_CLIENT_ID,
        vault: true
      }}
      style={{
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        tagline: false
      }}
    />
      </div>
      </div>
    )
  }

  async function SilverSubmit() {
    if (tier !== "silver") {
      console.log('fucking well updating.')
      await database.users.doc(docId).update({
        tier: "silver"
      })
      alert('upgraded to silver')
      window.location.reload()
      setCheatCodesOn(!cheatcodesOn)
    } else {
      // already upgraded.
      setMessage("already upgraded to silver")
      alert("already upgraded to silver")
    }
  }

    return (
        <div className="homecard">
            <p>{currentUser.email}</p>
            <UpSilverComponent />
            <div>your account: {tier}</div>

        </div>
    )
}

export default Upgrade
