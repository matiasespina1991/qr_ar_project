import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../src/config/firebaseConfig';
import Head from 'next/head';
import { FormatColorResetTwoTone } from '@material-ui/icons';

function ARView() {
  const router = useRouter();
  const { docId } = router.query;

  const [glbUrl, setGlbUrl] = useState(null);
  const [usdzUrl, setUsdzUrl] = useState(null);
  const [isInteriorModel, setIsInteriorModel] = useState(false);
  const [initialYPosition, setInitialYPosition] = useState(0);

  useEffect(() => {
    if (docId) {
      const fetchData = async () => {
        const db = firestore;
        const docRef = doc(db, "qr_codes", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setGlbUrl(data.glbUrl);
          setUsdzUrl(data.usdzUrl);
          setInitialYPosition(data.initialYPosition || 0);
          setIsInteriorModel(data.isInteriorModel);
        } else {
          console.log(`Error: The requested model doesn\'t seem to exist in the database. Please check that the id of the model you requested matches a document in the database. The requested model ID was: ${docId}`);
         
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

   

        {glbUrl ? (
         <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px'}}>
         <model-viewer 
           src={glbUrl} 
           auto-rotate 
           autoplay
           camera-controls
           shadow-intensity="1" 

           {...(isInteriorModel ? { 'camera-orbit': '0deg 75deg 0m' } : {})}
           {...(isInteriorModel ? { 'min-camera-orbit': 'auto auto 0m' } : {})}
           ar 
           ar-modes="scene-viewer webxr quick-look" 
           style={{width: '100%', height: '100%'}}
          //  camera-target={`0m ${initialYPosition}m 0m`} 
           ios-src={usdzUrl}
         >
               <button 
             slot="ar-button" 
             id="ar-button" 
             style={{
              position: 'absolute', 
              bottom: '4rem', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              display:'inline-flex', 
              alignItems: 'center',
              minWidth: '180px', 
              whiteSpace: 'nowrap' 
            }}
           >
                <a id="default-ar-button" part="default-ar-button" className="fab" tabIndex="2" aria-label="View in your space" style={{transform: 'scale(0.8)'}}>
                <svg version="1.1" id="view_x5F_in_x5F_AR_x5F_icon" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">

                    <rect id="Bounding_Box" x="0" y="0" fill="none" width="24" height="24"></rect>
                    <g id="Art_layer">
                      <path d="M3,4c0-0.55,0.45-1,1-1h2V1H4C2.35,1,1,2.35,1,4v2h2V4z"></path>
                      <path d="M20,3c0.55,0,1,0.45,1,1v2h2V4c0-1.65-1.35-3-3-3h-2v2H20z"></path>
                      <path d="M4,21c-0.55,0-1-0.45-1-1v-2H1v2c0,1.65,1.35,3,3,3h2v-2H4z"></path>
                      <path d="M20,21c0.55,0,1-0.45,1-1v-2h2v2c0,1.65-1.35,3-3,3h-2v-2H20z"></path>
                      <g>
                        <path d="M18.25,7.6l-5.5-3.18c-0.46-0.27-1.04-0.27-1.5,0L5.75,7.6C5.29,7.87,5,8.36,5,8.9v6.35c0,0.54,0.29,1.03,0.75,1.3
                          l5.5,3.18c0.46,0.27,1.04,0.27,1.5,0l5.5-3.18c0.46-0.27,0.75-0.76,0.75-1.3V8.9C19,8.36,18.71,7.87,18.25,7.6z M7,14.96v-4.62
                          l4,2.32v4.61L7,14.96z M12,10.93L8,8.61l4-2.31l4,2.31L12,10.93z M13,17.27v-4.61l4-2.32v4.62L13,17.27z"></path>
                      </g>
                    </g>
                  </svg>
                </a>
                <p style={{marginBottom: '0px', marginLeft: '0.3rem', marginRight: '0.3rem', color: 'black'}}>
                  View in your space
                </p>
                </button>
          </model-viewer>
        </div>
        ) : (
          <p>Loading model...</p>
        )}
      </div>
    </>
  );
}

export default ARView;
