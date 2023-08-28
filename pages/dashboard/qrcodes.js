import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import ProjectTables from "../../src/components/dashboard/ProjectTable";
import { collection, doc, getDoc, updateDoc, onSnapshot, query, getFirestore, where, orderBy, limit, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../../src/config/firebaseConfig";
import { CircularProgress, Dialog, DialogTitle, DialogActions, Button as MuiButton, Fab, Box, Typography, Button } from "@mui/material";
import { styled } from '@mui/system';
import { useDropzone } from "react-dropzone";
import Script from "next/script";
import { dataURLtoFile } from "../../src/functions/dataURLtoFile";
import AddIcon from '@mui/icons-material/Add';
import { uploadFileToFirebase } from "../../src/functions/uploadFileToFirebase";
import FullLayout from "../../src/layouts/FullLayout";
import { withProtected } from '../../src/hook/route';
import useAuth from "../../src/hook/auth";
import { purgeOrphanModelReferences } from "../../src/functions/dev_functions/purgeOrphanModelsReferences";
import { useSnackbar } from 'notistack';



const StyledDropzone = styled(Box)({
  color: '#7a7a7a',
  border: '2.5px dashed',
  height: '100%',
  margin: '0rem 2rem 1rem 2rem',
  padding: '16px',
  textAlign: 'center',
  display: 'flex',
  borderColor: '#C7C7C7',
  backgroundColor: '#F0F0F0',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  height: '15rem',
});

const StyledDialogPaper = styled(Dialog)({
  height: '100%',
  width: '100%',
});

const StyledFabPrimary = styled(Fab)({
  '&:hover': {
    backgroundColor: '#F8F9FA !important',
  },
});

const QrCodes = () => {

  const [qrCodesList, setQrCodesList] = useState([]);
  const [openModelUploadDialog, setOpenModelUploadDialog] = useState(false);
  const [glbFile, setGlbFile] = useState(null);
  const [acceptedFilesState, setAcceptedFilesState] = useState([]);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const { user } = useAuth();

  const db = getFirestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  useEffect(() => {
    let unsubscribeUser;
    let unsubscribeQrCodes;
  
    async function fetchData() {
      try {
        const userDocRef = doc(db, `users/${user.uid}`);
        unsubscribeUser = onSnapshot(userDocRef, async (snapshot) => {
          const uploadedModels = snapshot.data()?.uploadedModels || [];

          if(uploadedModels.length === 0) {
            setQrCodesList([]);
            return;
          }
  
          if (unsubscribeQrCodes) {
            unsubscribeQrCodes(); 
          }
          
          const q = query(
            collection(db, "qr_codes"),
            where("id", "in", uploadedModels),
            orderBy("_createdAt", "desc"),
            limit(30)
          );
  
          unsubscribeQrCodes = onSnapshot(q, (snapshot) => {
            let qrCodes = [];
  
            snapshot.forEach((doc) => {
              qrCodes.push({ ...doc.data(), id: doc.id });
            });
            setQrCodesList(qrCodes);
          });
        });
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
  
    fetchData();
  
    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeQrCodes) unsubscribeQrCodes();
    };
  }, [db, user.uid]);
  
  
  const onFileDropToDropzone = useCallback((acceptedFiles) => {

    if(acceptedFiles.length === 0) {
      enqueueSnackbar(
        'The file you are trying to upload does not correspond to a valid .glb file.', 
        {
          variant: 'error', 
          autoHideDuration: 4000
        }
      );
      console.log('ERROR: The file you are trying to upload does not correspond to a valid .glb file.')
      return;
    };


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
          
          uploadFileToFirebase(acceptedFilesState, modelPreviewDownloadURL, storage, db, 'glbFiles', (progress) => {setFileUploadProgress(progress)}, {userId: user.uid, userEmail: user.email})
         
      }
    );
    setGlbFile(null);
  }
 
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: onFileDropToDropzone,
    accept: {'model/gltf-binary': ['.glb'],}
  });

  const handleClose = () => {
    setGlbFile(null);
    setOpenModelUploadDialog(false);
  }

  const handleClickAddModel = () => {
    setOpenModelUploadDialog(true);
  }

  
  
  return (
    <>
      <Head>
        <title>QR AR - QR Codes</title>
        <meta name="description" content="QR AR by Cymatix Ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FullLayout>
        <Box style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'column', margin: '3rem', padding: 0}}>

          
          <Box style={{marginBottom: '2rem'}}>
            <StyledFabPrimary
              disabled={fileUploadProgress > 0 && fileUploadProgress < 100}
              aria-label="add"
              onClick={() => handleClickAddModel()}
              style={{
                backgroundColor: (fileUploadProgress > 0 && fileUploadProgress < 100) ? '#cbcbcb !important' : 'white',
                opacity: '0.8',
              
                minWidth: '3rem !important',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)',
                position: 'relative',
              }}
            >

              { fileUploadProgress > 0 && fileUploadProgress < 100 ? 
                <Typography sx={{color: 'black'}}>
                  {`${Math.floor(fileUploadProgress)}%`}
                </Typography>
                :
                <AddIcon
                  style={{
                    fontSize: '1.5rem',
                    position: 'relative',
                    top: '0.3px',
                    left: '0.5px',
                    opacity: '0.9'
                  }}  
                />
              }
              {/* <Typography>
                  {`${Math.floor(fileUploadProgress)}%`}
                </Typography> */}

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
            </StyledFabPrimary>
          </Box>
        
          
          <ProjectTables qrCodesList={qrCodesList} />
          

          <Box>
            <StyledDialogPaper open={openModelUploadDialog} onClose={handleClose} >
              <DialogTitle>Upload Model</DialogTitle>

              { 
                glbFile ? 
                (
                  <>
                    <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" />

                    <Box 
                      id="modelViewerContainer"
                      style={{height: '23rem', width: '33rem', margin: '0rem 2rem 1rem 2rem'}}
                      dangerouslySetInnerHTML={{
                        __html: `<model-viewer id="modelViewer" style="width: 100%; height: 400px;" src="${glbFile}" ar-modes="scene-viewer webxr" ar autoplay auto-rotate camera-controls></model-viewer>`,
                      }}
                    />
                  </>
                ) 
                  : 
                (
                  <StyledDropzone {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag and drop your 3D model in .glb format here, or click to select it.</p>
                    <svg style={{opacity: 0.5, width: '51px', height: '51px'}} className="MuiSvgIcon-root MuiDropzoneArea-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>
                  </StyledDropzone>
                ) 
              }

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
            </StyledDialogPaper>
          </Box>
        </Box>
      </FullLayout>
    </>
  );
};

export default withProtected(QrCodes);