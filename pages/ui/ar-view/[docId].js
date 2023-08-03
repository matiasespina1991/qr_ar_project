import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Script from 'next/script';
import { firestore } from '../../../src/config/firebaseConfig';

export default function ARView() {
  const router = useRouter();
  const { docId } = router.query;

  const [modelUrl, setModelUrl] = useState(null);

  ARView.isARView = true;

  useEffect(() => {
    if (docId) {
      const fetchDoc = async () => {
        const db = firestore;
        const docRef = doc(db, "qr_codes", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setModelUrl(data.modelUrl);
        } else {
          console.log("No such document!");
        }
      };

      fetchDoc();
    }
  }, [docId]);

  return (
    <div>
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" />

      {modelUrl ? (
        <model-viewer 
            src={modelUrl} 
            auto-rotate 
            camera-controls
            ar 
            ar-modes="scene-viewer webxr quick-look" 
            style={{width: '100%', height: '600px'}}
        ></model-viewer>
      ) : (
        <p>Loading model...</p>
      )}
    </div>
  );
}
