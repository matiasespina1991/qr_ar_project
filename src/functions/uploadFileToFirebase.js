import { addDoc, collection, setDoc, doc, arrayUnion, serverTimestamp  } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';



export const uploadFileToFirebase = async (files, modelPreviewImageUrl, storage, db, path, onProgress, {userId = "general", userEmail = '_'}) => {


  for (const file of files) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const originalFileName = file.name.split('.').slice(0, -1).join('.');
    const originalFileExtension = file.name.split('.').pop();
    const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`;
    const storageRef = ref(storage, `${path}/${userId}-${userEmail}/${newFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const glbDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', glbDownloadURL);

        const docData = {
          _debug_comments: null,
          _createdAt: serverTimestamp(),
          _updatedAt: serverTimestamp(),
          uploadedBy: userId,
          projectName: "Untitled Project",
          qrUrl: "",
          modelPreviewImageUrl: modelPreviewImageUrl,
          glbUrl: glbDownloadURL,
          status: "paused",
          isInteriorModel: false,
          usdzUrl: null,
        };

        // First add the doc and get the docId
        const docRef = await addDoc(collection(db, "qr_codes"), docData);
        const modelId = docRef.id;
        const _qrUrl = `http://qr-ar-project.vercel.app/ar-view/${modelId}`

        await setDoc(doc(db, "qr_codes", modelId), { qrUrl: _qrUrl, id: modelId}, { merge: true });
        await setDoc(doc(db, "users", userId), { uploadedModels: arrayUnion(modelId)}, { merge: true });

//    
      }
    );
  }
};



  export const uploadUsdzToFirebase = async (files, storage, db, onProgress, docId, {userId = "general", userEmail = '_'}) => {
    for (const _file of files) {
      const timestampInSeconds = Math.floor(Date.now() / 1000);
      const originalFileName = _file.name.split('.').slice(0, -1).join('.'); 
      const originalFileExtension = _file.name.split('.').pop(); 
      const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`; 
      const storageRef = ref(storage, `usdzFiles/${userId}-${userEmail}/${newFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, _file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.log(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
  
          const docData = {
            usdzUrl:  downloadURL,
          };
          
          await setDoc(doc(db, "qr_codes", docId), { usdzUrl: downloadURL}, { merge: true });

        
          
          
        }
      );
    }
  };
