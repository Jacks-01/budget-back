import express, {request, response} from "express"
import {db} from "../db"
import {addDoc, collection, doc, setDoc} from "firebase/firestore"
import authCheck from "../middleware/authCheck"

const router = express.Router()

router.get("/create", authCheck, async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      email: "test@gmail.com",
    })

    console.log("Document written with ID: ", docRef.id)
    res.status(200).send("document created")
  } catch (error) {
    console.error(error)
  }
})

export default router
