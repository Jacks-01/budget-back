import express, {request, response} from "express"
import {db} from "../db"
import {addDoc, collection, doc, setDoc} from "firebase/firestore"
import authCheck from "../middleware/authCheck"

const router = express.Router()

router.post("/create", authCheck, async (req, res) => {
  try {
    const userId = req.auth.payload.sub
    const userEmail = req.body.email
    console.log("user email", userEmail)
    console.log("JWT sub:", req.auth.payload.sub)
    const docRef = await addDoc(collection(db, "users"), {
      email: "test@gmail.com",
      id: userId,
    })

    console.log("Document written with ID: ", docRef.id)
    res.status(200).send("document created")
  } catch (error) {
    console.error(error)
  }
})

export default router
