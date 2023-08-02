import { collection, getDocs } from "firebase/firestore";

async function getQrCodes(db) {
    const qrCollection = collection(db, 'qr_codes');
    const QrColSnapshot = await getDocs(qrCollection);
    const qrList = QrColSnapshot.docs.map(doc => doc.data());
    return qrList;
  }

  export default getQrCodes;