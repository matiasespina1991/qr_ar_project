import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, setDoc } from "firebase/firestore";

export const uploadFileToFirebase = async (files, modelPreviewImageUrl, storage, db, path, onProgress, {userId = "general"}) => {

  for (const file of files) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const originalFileName = file.name.split('.').slice(0, -1).join('.');
    const originalFileExtension = file.name.split('.').pop();
    const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`;
    const storageRef = ref(storage, `${path}/${userId}/${newFileName}`);
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
          projectName: "Untitled 1",
          qrUrl: "",
          modelPreviewImageUrl: modelPreviewImageUrl,
          glbUrl: glbDownloadURL,
          status: "paused",
          isInteriorModel: false,
          usdzUrl: null,
        };

        // First add the doc and get the docId
        const docRef = await addDoc(collection(db, "qr_codes"), docData);
        const docId = docRef.id;
        const _qrUrl = `http://qr-ar-project.vercel.app/ui/ar-view/${docId}`

        await setDoc(doc(db, "qr_codes", docId), { qrUrl: _qrUrl}, { merge: true });
      }
    );
  }
};



  const uploadUsdzToFirebase = async (files, storage, db, onProgress, {userId = "general"}) => {
    for (const _file of files) {
      const timestampInSeconds = Math.floor(Date.now() / 1000);
      const originalFileName = _file.name.split('.').slice(0, -1).join('.'); 
      const originalFileExtension = _file.name.split('.').pop(); 
      const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`; 
      const storageRef = ref(storage, `usdzFiles/${userId}/${newFileName}`);
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
