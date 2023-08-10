import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../src/config/firebaseConfig';
import Head from 'next/head';

function ARView() {
  const router = useRouter();
  const { docId } = router.query;

  console.log('docId', docId);

  const [modelUrl, setModelUrl] = useState(null);
  const [usdzUrl, setUsdzUrl] = useState(null);

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        const db = firestore;
        const docRef = doc(db, "qr_codes", docId);
        const docSnap = await getDoc(docRef);
        console.log('docSnap:', docSnap);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
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

 
 return (
    <>
      <Head>
        <title>AR View</title>
        <meta
          name="description"
          content="AR View Page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" />

        {modelUrl ? (
          <model-viewer 
            src={modelUrl} 
            auto-rotate 
            autoplay
            camera-controls
            shadow-intensity="1" 
            minCameraOrbit="auto auto 0m"
            // camera-orbit="0deg 75deg 125.1m" 
            // camera-target="0.000004306m 26m 30.42m"
            // field-of-view="30deg"
            ar 
            ar-modes="scene-viewer webxr quick-look" 
            style={{width: '100%', height: '600px'}}
            ios-src={usdzUrl}
          >
           
            <button slot="ar-button" id="ar-button">
              View in your space
            </button>
          </model-viewer>
        ) : (
          <p>Loading model...</p>
        )}
      </div>
    </>
  );
}

export default ARView;
