import { useEffect, useState } from 'react';
import Script from 'next/script';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../src/config/firebaseConfig';

function ARView({ modelUrl, usdzUrl }) {

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

export async function getServerSideProps(context) {
  const { docId } = context.query;
  const db = firestore;
  const docRef = doc(db, "qr_codes", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      props: {
        modelUrl: data.modelUrl || null,
        usdzUrl: data.usdzUrl || null,
      },
    };
  } else {
    // You can handle redirection here if the document doesn't exist or return a 404 status.
    return {
      notFound: true, // Returns a 404 status
    };
  }
}
