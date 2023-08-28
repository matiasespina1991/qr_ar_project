import { doc, getDoc, updateDoc, getFirestore, } from "firebase/firestore";
import CurrentUserData from "../../hook/CurrentUserData"

const currentUserData =  new CurrentUserData();

export const purgeOrphanModelReferences = async () => {
    const db = getFirestore();

   
    
    try {
      const userUid = currentUserData.getCurrentUid();
      
      console.log("userUid: ", userUid);


      if (!userUid) {
        console.log("userUid returned null, aborting...");
        return;
      }
  
      const userDocRef = doc(db, 'users', userUid);
      
      const userDocSnapshot = await getDoc(userDocRef);
      let uploadedModels = userDocSnapshot.data().uploadedModels || [];
      
      let updatedUploadedModels = [...uploadedModels]; 
  
     
      for (let i = 0; i < uploadedModels.length; i++) {
        const modelId = uploadedModels[i];
        const modelDocRef = doc(db, 'qr_codes', modelId);
        const modelDocSnapshot = await getDoc(modelDocRef);
  
        if (!modelDocSnapshot.exists()) {
          const indexToRemove = updatedUploadedModels.indexOf(modelId);
          if (indexToRemove > -1) {
            updatedUploadedModels.splice(indexToRemove, 1);
          }
        }
      }
      
      await updateDoc(userDocRef, {
        uploadedModels: updatedUploadedModels
      });
  
    } catch (error) {
      console.error("Error fixing uploaded models: ", error);
    }
  };