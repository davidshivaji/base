# base

An extensive boilerplate React App and Express Server using Firebase v7 + Google Cloud, and the PayPal Developer SDK.

## Live Demo
[base.davidshivaji.com](https://base.davidshivaji.com)

- Basic Navbar with Customized Routes.
  - *App page is left empty.*
- Sidebar Menu toggle with logout button and subnavs for settings pages.
  - *Settings subnavs are both empty with no styling.*
  - Main settings page contains 2FA Option.
- Sign up, log in, add name, bio info, profile picture, upgrade to pro membership.


## Features

- Authenticate with Email/Password or Google Account.
- Basic account management; change email, password, etc.
- Optional 2-Factor Authentication with Phone Number.
- Conditional Private Routes for User Account Tiers.
- Recurring Payments for Pro Membership using PayPal.

## To run this and build something with it, you will need:
Firebase account, PayPal developer account.

You can run the client react app without needing the server, unless you want to make external API calls.

## Setup

### 0. Clone this repo
```
git clone https://github.com/davidshivaji/base
cd base
npm run full-install
```

### 1. Create a Firebase Project
Open [Firebase](https://console.firebase.google.com) and create a new project.

### 2. Enable Multi-Factor Authentication
Open the [Google Cloud Console](https://console.cloud.google.com), access your project, go to the Identity Platform > MFA, and enable Multi-Factor Authentication.

### 3. Create a .env file
Inside the **client** folder, create a
```.env``` file
containing the keys to your firebase app:
```
REACT_APP_FIREBASE_API_KEY=<apiKey>
REACT_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
REACT_APP_FIREBASE_PROJECT_ID=<projectId>
REACT_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
REACT_APP_FIREBASE_APP_ID=<appId>
REACT_APP_FIREBASE_MEASUREMENT_ID=<measurementId>
```


### 4. Create a PayPal App
Open the [PayPal Developer Dashboard](https://developer.paypal.com) and create a new app.
Make a note of your App's Client ID and Client Secret.

*It is recommended to start with the sandbox first.*

To do this, use your sandbox app's Client ID, ensure that "sandbox." precedes "api" in all REST API calls, and change PRODUCTION to SANDBOX in client/src/account/Upgrade.js and client/public/index.html.

### 5. Create a Subscription Plan & Product

The easiest way is to go to [paypal.com/billing/plans](https://paypal.com/billing/plans) and create a subscription plan using the interface.

Otherwise you can [generate an access token](https://www.paypal.com/au/smarthelp/article/how-do-i-get-an-access-token-ts2128) and follow [this guide](https://developer.paypal.com/docs/subscriptions/integrate/) to create your subscription plan via the REST API.

### 6. Add PayPal Credentials to `.env` file

**Note: It is recommended that you use your SANDBOX credentials for testing before production.**

```
REACT_APP_PAYPAL_PRODUCTION_CLIENT_ID=<paypal_app_client_id>
REACT_APP_PAYPAL_SUBSCRIPTION_PLAN_ID=<paypal_subscription_plan_id>
```

### 7. Run App
You can now use react-scripts commands to run the client app or build and deploy.
```
cd client
npm start
```


## Using The Server
If you want to use the server, you will need a separate .env file inside server/ containing your API keys.
For the example, I've used `REACT_APP_CMC_API_KEY` which will enable you to make calls to the coinmarketcap API.
You can then make fetch/axios requests from anywhere in the client app which can directly reference the routes in the express server.
To deploy, you will need to replace the proxy URL (localhost:5000) inside client/package.json with your server's heroku URL or wherever you decide to host your server.


