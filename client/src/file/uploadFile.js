// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase'

const uploadFile = (file, filePath) => {
  return new Promise(async (resolve, reject) => {
    const storageRef = storage.ref(storage, filePath)
    try {
      await storage.uploadBytes(storageRef, file)
      const url = await storage.getDownloadURL(storageRef)
      resolve(url)
    } catch (error) {
      reject(error)
    }
  })
}

export default uploadFile
