import { getDocs, collection  } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { query } from "firebase/firestore";


export default async function getAdmin() {
    const adminDatabase = collection( firestore, 'admin')
    let admin = []

    const adminQuery = query(
      adminDatabase
    )

    const adminQuerySnapshot = await getDocs(adminQuery)
    adminQuerySnapshot.forEach((snap)=>{
      admin.push(
        {...snap.data(), id: snap.id}
        )
    })

    return admin;
}