import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../src/config/firebaseConfig';

function ARView() {
  const router = useRouter();
  const { docId } = router.query;

  const [modelUrl, setModelUrl] = useState(null);
  const [usdzUrl, setUsdzUrl] = useState(null);

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        const db = firestore;
        const docRef = doc(db, "qr_codes", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setModelUrl(data.modelUrl);
          setUsdzUrl(data.usdzUrl);
        } else {
          // You can handle redirection here if the document doesn't exist or return a 404 status.
          router.replace('/404');
        }
      }

      fetchData();
    }
  }, [docId]); // The useEffect will re-run when `docId` changes

  ARView.isARView = true;

  return (
    <div>
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" />

      {modelUrl ? (
        <model-viewer 
            src={modelUrl} 
            auto-rotate 
            autoplay
            camera-controls
            ar 
            ar-modes="scene-viewer webxr quick-look" 
            style={{width: '100%', height: '600px'}}
            ios-src={usdzUrl}
        ></model-viewer>
      ) : (
        <p>Loading model...</p>
      )}
    </div>
  );
}

export default ARView;
