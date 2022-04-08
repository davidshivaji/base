import React, { useState, useEffect, useContext } from 'react'
import { useAuth, AuthContext } from "../auth/Auth"
import { v4 as uuidv4 } from 'uuid'
import app, { database, storage } from '../firebase'
import deleteFile from '../file/deleteFile'
import uploadFile from '../file/uploadFile'
import PasswordChange from './PasswordChange'
import EmailChange from './EmailChange'
import DisplayPicture from './profile/DP'


export const Account = () => {
  const { currentUser, tier } = useAuth()
  console.log(currentUser.uid)
  const [showDPChange, setShowDPChange] = useState(false)
  const [editState, setEditState] = useState(false)
  const [showDPChangeButton, setShowDPChangeButton] = useState(true)
  const [dP, setDP] = useState('')
  const [nameInit, setNameInit] = useState(null)
  const [userData, setUserData] = useState(null)
  const [dataemail, setEmail] = useState(null)
  const [datafirstname, setFirstName] = useState(null)
  const [datalastname, setLastName] = useState(null)
  const [databio, setBio] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [docId, setDocId] = useState(null)

  const [randomThing, setRandomThing] = useState(null)

  const [name, setName] = useState(currentUser?.displayName)
  const [file, setFile] = useState(null)
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL)

  // const usersRef = collection(db, "users")

  useEffect(() => {
    // do nothing.
    console.log('should be re-rendering')
  }, [randomThing])

  useEffect(() => {
    database.users.where("userId", "==", currentUser.uid)
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        console.log(doc)
        setUserData(doc.data())
        setEmail(doc.data().email)
        setFirstName(doc.data().firstname)
        setNameInit(doc.data().firstname)
        setLastName(doc.data().lastname)
        setBio(doc.data().bio)
        setDocId(doc.id)
      })
    })

  }, [])

  useEffect(() => {
      if (currentUser) {
        setDP(currentUser?.photoURL)
      }
  }, [currentUser])

  // const { email, lastname, }

  useEffect(() => {
    console.log(dP)
  }, [dP])

  useEffect(() => {
    // docId's fucking null. perhaps it was not created.
    // yeah never created. fucks sake.
    console.log(docId)
  }, [docId])

  useEffect(() => {
    console.log(userData);
  }, [userData])

  function handleBioChange(e) {
    setBio(e.target.value)
  }

  function handleFirstNameChange(e) {
    setFirstName(e.target.value)
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value)
  }


  async function changeDetails(e) {
    e.preventDefault()

    // make an actual query for this.
  await database.users.doc(docId).update({
        firstname: datafirstname,
        lastname: datalastname,
        bio: databio
      })


  }



  const handlePhotoChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setFile(file)
      setPhotoURL(URL.createObjectURL(file))
    }
  }

  const handlePhotoSubmit = async (e) => {
    e.preventDefault()
    let userObj = { displayName: name}

    try {
      if (file) {
        const imageName = uuidv4 + '.' + file?.name?.split('.')?.pop()
        const url = await uploadFile(file, `files/${currentUser?.uid}/${imageName}`)

        if (currentUser.photoURL) {
          const prevImage = currentUser?.photoURL
          ?.split(`${currentUser?.uid}%2F`)[1]
          .split('?')[0]

          if (prevImage) {
            try {
              await deleteFile(`files/${currentUser.uid}/${prevImage}`)
            } catch (error) {
              console.log(error)
            }
          }
        }
        userObj = { ...userObj, photoURL: url}

      }
        await currentUser.updateProfile(userObj)

      } catch (error) {
          console.log(error)
      }

    }

    async function upload(file, currentUser, setLoading) {
        // const fileRef = ref(storage, currentUser.uid + '.png')

        setLoading(true)

        const uploadTask = storage.ref(`/files/${currentUser.uid}/dp.jpg`).put(file).then(data => {
          console.log(data)
          data.ref.getDownloadURL().then(url => {
            console.log(url)
            setDP(url)
            database.users.doc(docId).update( { dp: url} )
          }
            )

          })

        setLoading(false)
        alert("Uploaded file!")
}


    const AddProfilePicture = () => {
      const { currentUser } = useAuth()
      const [photo, setPhoto] = useState(null)
      const [loading, setLoading] = useState(false)
      const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png")

    function handleChange(e) {
      if (e.target.files[0]) {
        setPhoto(e.target.files[0])
      }
    }

    function handleClick() {
      upload(photo, currentUser, setLoading)
    }

    useEffect(() => {
      if (currentUser?.photoURL) {
        setPhotoURL(currentUser.photoURL)
      }
    }, [currentUser])

    return (
      <div className="fields">
      <p>Upload Profile Picture</p>
        <input type="file" onChange={handleChange} />
        <button className="submitbutton" disabled={loading || !photo} onClick={handleClick}>Upload</button>
      </div>
    )
  }

    // provide an animation


    return (
        <div className="homecard">
            <h1>{tier}</h1>
            <h2>
            Welcome {nameInit}!
            </h2>
            <div className="user-account-info">
            {currentUser.emailVerified ? <p>email verified</p> : <p>verify your email</p>}
            </div>
            <div className="user-profile">
            <div className="profilepicturewrap">
            <img className="profilepicture" src={dP} alt="display picture" onClick={() => console.log('clicked')} onMouseOver={() => setShowDPChangeButton(true)} onMouseOut={() => setShowDPChangeButton(true)} />
            </div>
            <div className="user-metadata">
            <button className="ui-button editprofilebutton" onClick={() => setEditState(!editState)}> <i className="fas fa-edit"> </i> </button>
            <span>{nameInit} <b className="user-name">{datalastname}</b></span>
            <br/>
            <div className="bio">{databio}</div>
            <br/>
            <br/>
            </div>
            </div>
            {editState &&
              <>
            <form className="change-details" onSubmit={changeDetails} action="">
                <input value={dataemail} name="email" type="email" disabled={disabled} />
                <input onChange={handleFirstNameChange} value={datafirstname} name="firstname" placeholder="First Name" type="text"/>
                <input onChange={handleLastNameChange} value={datalastname} name="lastname" placeholder="Last Name" type="text"/>
                <input onChange={handleBioChange} value={databio} name="bio" placeholder="Bio" type="text"/>
                <button type="submit">Submit</button>
            </form>
            <EmailChange />
            <PasswordChange />
            <DisplayPicture randomThing={randomThing} setRandomThing={setRandomThing} />
            </>
          }

        </div>
    )

}

export default Account
