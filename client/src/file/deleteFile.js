// this is fine for deleting files from storage.
// all the userDelete function will be, is this, for every filepath
// connected to a specific user.
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../firebase'

const deleteFile = (filePath) => {
    const imageRef = storage.ref(filePath)
    return storage.deleteObject(imageRef)
}

export default deleteFile
