import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { Row, Button } from "reactstrap";
import ProjectTables from "../../src/components/dashboard/ProjectTable";
import { doc,setDoc, addDoc, collection, onSnapshot, query, getFirestore } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../../src/config/firebaseConfig";
import { Dialog, DialogTitle, DialogActions, Button as MuiButton, makeStyles, Box } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { CircularProgress } from '@material-ui/core';
import Script from "next/script";
import { useStyles } from "../../styles/styles";
import { dataURLtoFile } from "../../src/utils/utils";
import { uploadFileToFirebase } from "../../src/functions/uploadFileToFirebase";

const QrCodes = () => {

  const [qrCodesList, setQrCodesList] = useState([]);
  const [openModelUploadDialog, setOpenModelUploadDialog] = useState(false);
  const [glbFile, setGlbFile] = useState(null);
  const [acceptedFilesState, setAcceptedFilesState] = useState([]);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, "qr_codes"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let qrCodes = [];
      snapshot.forEach((doc) => {
        qrCodes.push({...doc.data(), id: doc.id});
      });
      setQrCodesList(qrCodes);
    });

    return () => unsubscribe();
  }, [db]);

  const classes = useStyles();

  const onFileDropToDropzone = useCallback((acceptedFiles) => {
    setAcceptedFilesState(acceptedFiles)
    const _glbFile = acceptedFiles[0];
    setGlbFile(URL.createObjectURL(_glbFile));
   
    
  }, []);

  const captureModelScreenshot = async (modelViewer) => {
    const canvas = modelViewer.shadowRoot.querySelector('canvas');
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    
    return dataUrl;
  };  

  const handleSubmit = async () => {  
    setOpenModelUploadDialog(false);
    const modelViewer = document.getElementById('modelViewer');
    if (!modelViewer) return;
    
    const modelPreviewDataUrl = await captureModelScreenshot(modelViewer);
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const modelPreviewFile = dataURLtoFile(modelPreviewDataUrl, `model-preview-${timestampInSeconds}.png`);
    const modelPreviewStorageRef = ref(storage, `modelPreviewImages/general/${modelPreviewFile.name}`);
    const modelPreviewUploadTask = uploadBytesResumable(modelPreviewStorageRef, modelPreviewFile);
    
  
    modelPreviewUploadTask.on('state_changed', 
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Model preview upload is ' + progress + '% done');
      }, 
      (error) => {
          console.log(error);
      }, 
      async () => {
          const modelPreviewDownloadURL = await getDownloadURL(modelPreviewUploadTask.snapshot.ref);
          console.log('Model preview available at', modelPreviewDownloadURL);
          
          uploadFileToFirebase(acceptedFilesState, modelPreviewDownloadURL, storage, db, 'glbFiles', (progress) => {setFileUploadProgress(progress)}, {userId: "general"})
         
      }
    );
    setGlbFile(null);
  }
  

  const { getRootProps, getInputProps } = useDropzone({ onDrop: onFileDropToDropzone, accept: '.glb' });

  const handleClose = () => {
    setGlbFile(null);
    setOpenModelUploadDialog(false);
  }

  const handleClickAddModel = () => {
    setOpenModelUploadDialog(true);
  }



  // const uploadFileToFirebase = async (files, modelPreviewImageUrl) => {
  //   for (const file of files) {
  //     const timestampInSeconds = Math.floor(Date.now() / 1000);
  //     const originalFileName = file.name.split('.').slice(0, -1).join('.'); 
  //     const originalFileExtension = file.name.split('.').pop(); 
  //     const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`; 
  //     const storageRef = ref(storage, `glbFiles/general/${newFileName}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);
  
  //     uploadTask.on('state_changed', 
  //       (snapshot) => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setFileUploadProgress(progress);
  //         console.log('Upload is ' + progress + '% done');
  //       }, 
  //       (error) => {
  //         console.log(error);
  //       }, 
  //       async () => {
  //         const glbDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //         console.log('File available at', glbDownloadURL);
  
  //         const docData = {
  //           _debug_comments: null,
  //           projectName: "Untitled 1",
  //           qrUrl: "",
  //           modelPreviewImageUrl: modelPreviewImageUrl,
  //           glbUrl: glbDownloadURL,
  //           status: "paused",
  //           isInteriorModel: false,
  //           usdzUrl: null,
  //         };
          
  //         // First add the doc and get the docId
  //         const docRef = await addDoc(collection(db, "qr_codes"), docData);
  //         const docId = docRef.id;
  //         const _qrUrl = `http://qr-ar-project.vercel.app/ui/ar-view/${docId}`

  //         await setDoc(doc(db, "qr_codes", docId), { qrUrl: _qrUrl}, { merge: true });
          
  //       }
  //     );
  //   }
  // };
  
  
  return (
    <Box>

    
      <Head>
        <title>QR AR - QR Codes</title>
        <meta name="description" content="QR AR by Cymatix Ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" strategy="beforeInteractive" />

      <Box className="d-flex justify-content-end p-3">
        <Button  
          disabled={fileUploadProgress > 0 && fileUploadProgress < 100}
          style={{
            backgroundColor: (fileUploadProgress > 0 && fileUploadProgress < 100) ? '#cbcbcb' : 'white',
            opacity: '0.8',
            color: (fileUploadProgress > 0 && fileUploadProgress < 100) ? 'white' : 'black',
            borderColor: 'transparent',
            borderRadius: '50%',
            height: '3rem !important',
            minWidth: '3rem !important',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}
          onClick={() => handleClickAddModel()}
        >
          <i
            className="bi bi-plus"
            style={{
              fontSize: '1.5rem',
              position: 'relative',
              top: '0.3px',
              left: '0.5px',
              opacity: '0.9'
            }}  
          ></i>
          { fileUploadProgress > 0 && fileUploadProgress < 100 && 
            <CircularProgress 
              variant="determinate"
              value={fileUploadProgress}
              size={64}
            
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                color: '#2962ff',
                marginTop: -32,
                marginLeft: -32,
              }}
            /> 
          }
        </Button>
      </Box>

    
      <Row>
        <ProjectTables qrCodesList={qrCodesList} />
      </Row>

      <Box>
        <Dialog open={openModelUploadDialog} onClose={handleClose} classes={{ paper: classes.dialogPaper }} >
          <DialogTitle>Upload Model</DialogTitle>

          {glbFile ? (
            <>
             <Box 
                id="modelViewerContainer"
                style={{height: '23rem'}}
                dangerouslySetInnerHTML={{
                  __html: `<model-viewer id="modelViewer" style="width: 100%; height: 400px;" src="${glbFile}" ar-modes="scene-viewer webxr" ar autoplay auto-rotate camera-controls></model-viewer>`,
                }}
              />
            </>
          
          ) : (
              <Box {...getRootProps()} className={classes.dropzone}>
                <input {...getInputProps()} />
                <p>Drag and drop your 3D model in .glb format here, or click to select it.</p>
                <svg style={{opacity: 0.5, width: '51px', height: '51px'}} className="MuiSvgIcon-root MuiDropzoneArea-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>
              </Box>
          ) }

          <DialogActions>
            <MuiButton onClick={handleClose} color="primary">
              Cancel
            </MuiButton>
            {
              glbFile &&
              <MuiButton onClick={handleSubmit} color="primary">
                submit
              </MuiButton>
            }
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default QrCodes;