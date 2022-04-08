import React, { useState, useEffect } from 'react'
// import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'
import { useAuth } from '../../auth/Auth'
import { v4 as uuidv4 } from 'uuid';
import deleteFile from '../../file/deleteFile'
import firebase from 'firebase'
import 'firebase/auth'

const auth = firebase.auth()

const DisplayPicture = (props) => {
  const { currentUser } = useAuth()
  const [file, setFile] = useState(null)
  const [name, setName] = useState(currentUser?.displayName)
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL)

  const { randomThing, setRandomThing } = props

  useEffect(() => {
    console.log(randomThing)
  }, [randomThing])

  useEffect(() => {
    console.log(photoURL)
  }, [photoURL])

    const handleChange = (e) => {
      const file = e.target.files[0]

      if (file) {
        setFile(file)
        setPhotoURL(URL.createObjectURL(file))
      }

    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      let userObj = { displayName: name }

    try {
      if (file) {
        // keep the original extension.
        // this will enable png files to work too. could be useful.
        const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
        console.log(imageName)
        // instead of using a uuid, just use dpRef.
        // instead of using uploadFile, use its composition directly.
        // we just need to determine the file's name.
        console.log(file)
        // REFERENCE
        const dpRef = firebase.storage().ref().child(`files/${currentUser.uid}/${imageName}`)

        // await storage.uploadBytes(dpRef, file)
        await dpRef.put(file).then(snap => console.log(snap))
        const url = await dpRef.getDownloadURL()
        // window.location.reload()
        // if url gets created, it implies that promise was resolved.
        // so now it's just
        if (currentUser?.photoURL) {
          // this is gonna be false but add it anyway.
          // console.log
          console.log(currentUser.photoURL)
          const prevImage = currentUser?.photoURL
          // if it contains a profileURL that isn't null.
          // grab the thing after the folder/
          ?.split(`${currentUser?.uid}%2F`)[1]
          // then if there's a question mark, get the first piece. ignore any queries.
          // we just need the filename.
          .split('?')[0]
          // set prevImage equal to that.


          // if truthy
          if (prevImage) {
            try {
              // delete the previous dp.
              // if there's no current user, don't throw an undefined error.
              await deleteFile(`files/${currentUser?.uid}/${prevImage}`)
            } catch (error) {
              console.log(error)
            }
          }
        }

        userObj = { ...userObj, photoURL: url }
        console.log(userObj)


        await currentUser.updateProfile(userObj)
        console.log(currentUser)
        console.log(currentUser.photoURL)
        setRandomThing('make account page re-render')
        setPhotoURL(currentUser.photoURL)

      }
    } catch (error) {
      console.log(error)
    }

  }

    return (
        <div className="dpdiv">
        <img src={photoURL} width="50px" alt=""/>
            <h3>Profile Picture</h3>
            <form action="" onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange}/>
            <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default DisplayPicture
