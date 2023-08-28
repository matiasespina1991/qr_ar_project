import { useState, useRef, useEffect, useCallback } from "react";
// import { Card, CardBody, CardTitle, CardSubtitle, Table, Button } from "reactstrap";
import { doc, updateDoc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import QRCode from "qrcode.react";
import { Card, Dialog, DialogTitle, DialogActions, Button, Button as MuiButton, makeStyles, Box, CircularProgress, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardContent } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { storage } from '../../config/firebaseConfig'
import { uploadUsdzToFirebase } from "../../functions/uploadFileToFirebase";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SettingsIcon from '@material-ui/icons/Settings';
import useAuth from "../../hook/auth";
import { useSnackbar } from 'notistack';

export const useStyles = makeStyles((theme) => ({
  dropzone: {
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
    alignItems: 'center'
  },
  dialogPaper: {
    height: '100%',
    maxHeight: '30rem',
    width: '100%',
    maxWidth: '60rem',
  },
}), {index: 1});



const ProjectTables = ({ qrCodesList }) => {
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const inputRef = useRef(null); // Create a ref
  const [acceptedFilesState, setAcceptedFilesState] = useState([]);
  const [openUsdzUpload, setOpenUsdzUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [docId, setDocId] = useState(null); // To store the current doc id for the operation

  const { user } = useAuth();

  const classes = useStyles();

  const db = getFirestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onDrop = useCallback(async (acceptedFiles) => {

    if(acceptedFiles.length === 0) {
      enqueueSnackbar(
        'The file you are trying to upload does not correspond to a valid .usdz file.', 
        {
          variant: 'error', 
          autoHideDuration: 4000
        }
      );
      console.log('ERROR: The file you are trying to upload does not correspond to a valid .usdz file.')
      return;
    };

    setAcceptedFilesState(acceptedFiles);
    const fileObject = acceptedFiles[0];
    setFile(URL.createObjectURL(fileObject));
    
    if (fileObject) {
      await uploadUsdzToFirebase([fileObject], storage, db, (progress) => setProgress(progress), docId, { userId: user.uid, userEmail: user.email });
    }
    setOpenUsdzUpload(false);
    setFile(null);
    setProgress(0); 
  
  }, [db, docId, storage, user.email, user.uid]);
  

  useEffect(() => {
    if(progress === 100) {
      setProgress(0);
    }
  }, [progress]);

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: {'model/vnd.usdz+zip': ['.usdz']}
});




  const handleEdit = (id, name) => {
    setEditing(true);
    setEditingId(id);
    setEditName(name);
  };

  const handleSave = async (id) => {
    const db = getFirestore();
    const docRef = doc(db, "qr_codes", id);
    await updateDoc(docRef, { projectName: editName });
    setEditing(false);
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (event, id) => {
    if (event.key === 'Enter') {
      handleSave(id);
    }
  };

  const handleClickUsdzUpload = (id) => {
    setOpenUsdzUpload(true);
    setDocId(id); 
  };


  const handleCloseUsdzUpload = () => {
    setOpenUsdzUpload(false);
  };
  


  const toggleInteriorModel = async (docId) =>  {

    const modelDocRef = doc(db, "qr_codes", docId);

    const modelDocSnapshot = await getDoc(modelDocRef);

    if (modelDocSnapshot.exists) {
      const modelData = modelDocSnapshot.data();
      const currentIsModelInteriorValue = modelData.isInteriorModel;
  
      
      await setDoc(doc(db, "qr_codes", docId), { isInteriorModel: !currentIsModelInteriorValue}, { merge: true }).catch((error) => {
        console.log("Error getting document:", error);
      });  
    } else {
      console.log("Error when setting model to interior model. Document of the model does not exist");
    }
  };
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditing(false);
        setEditingId(null);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  if(qrCodesList.length === 0) {
    return ( <> </>);
  }


  return (
    <>
      <Card style={{width: '100%'}}>
        <CardContent>
          <Typography variant="h5">QR Codes</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of the QR codes
          </Typography>
          <TableContainer>
            <Table className="text-nowrap mt-2 align-middle">
              <TableHead>
                <TableRow>
                  <TableCell style={{ paddingLeft: '2.4rem' }}>QR Preview</TableCell>
                  <TableCell style={{ paddingLeft: '1.5rem' }}>Preview</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Formats</TableCell>
                  <TableCell>is Interior Model</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Settings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {qrCodesList && qrCodesList.map((tdata, index) => (

                  <TableRow key={tdata.id}>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" p={4}>
                        <a href={tdata.qrUrl} target="_blank" rel="noopener noreferrer">
                          <QRCode id="qr-code-el" value={tdata.qrUrl} size={105} includeMargin={true} />
                        </a>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {tdata.modelPreviewImageUrl ? 
                        <img 
                          style={{objectFit: 'cover', objectPosition: 'center center', width: '6rem', height: '6rem'}}
                          src={tdata.modelPreviewImageUrl}
                        />
                        : 'N/A'
                      }
                    </TableCell>

                    <TableCell style={{maxWidth: '15rem'}}>
                      <Box style={{whiteSpace: 'break-spaces'}}>
                        {editing && editingId === tdata.id ? (
                          <input
                            ref={inputRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, tdata.id)}
                            style={{ width: `${editName.length + 1}ch` }}
                            autoFocus
                          />
                        ) : (
                          <Typography component="span" onClick={() => handleEdit(tdata.id, tdata.projectName)}>
                            {tdata.projectName}
                          </Typography>
                        )}
                        {tdata._debug_comments && (
                          <Box style={{ 
            
                            whiteSpace: 'break-spaces',
                          }}>
                            <Typography variant="body2" color="textSecondary" component="div" 
                            >
                              ( {tdata._debug_comments} )
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box display="inline-flex" flexDirection="column" transform="scale(0.9)">
                        <Box display="inline-flex" marginLeft="1.13rem">
                          <Typography style={{marginBottom: 0}}>
                            glb
                            <span 
                              style={{
                                padding: '0.35rem',
                                marginLeft: '0.35rem',
                                position: 'relative',
                                top: '0.8px'
                              }} 
                              className={`${tdata.glbUrl ? 'bg-success': 'bg-danger'} rounded-circle d-inline-block`}
                            />
                          </Typography>
                        </Box>
                        <Box display="inline-flex" alignItems="center">
                          <Button onClick={() => handleClickUsdzUpload(tdata.id)} style={{background: 'transparent', border: 'none', padding: 'unset', color: '#000000db', textTransform: 'none'}}>
                            <Box display="inline-flex">
                              <Typography style={{marginBottom: 0}}>
                                usdz
                                <span
                                  style={{
                                    padding: '0.39rem',
                                    marginLeft: '0.35rem',
                                    position: 'relative',
                                    top: '0.8px',
                                    backgroundColor: tdata.usdzUrl ? '#0AB7AF' : '#f44336'
                                  }}
                                  className={`${tdata.usdzUrl ? 'bg-success' : 'bg-danger'} rounded-circle d-inline-block`}
                                />
                              </Typography>
                            </Box>
                          </Button>

                          {tdata.id === docId && progress ? (
                            <CircularProgress variant="determinate" style={{marginLeft: 2.5}} size={11} thickness={9}  value={progress} color='primary' />
                          ) : null}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box style={{ paddingLeft: '2.4rem' }}>
                        <Button
                          style={{ background: 'none', padding: 0 }}
                          onClick={() => toggleInteriorModel(tdata.id)}
                        >
                          {tdata.isInteriorModel === true ? (
                            <FiberManualRecordIcon style={{color: '#0AB7AF'}} />

                          ) : tdata.isInteriorModel === false ? (
                            <FiberManualRecordIcon style={{color: '#f44336'}} />
                          ) : null}
                        </Button>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {tdata.status === "pending" ? (
                        <FiberManualRecordIcon color="secondary" />
                      ) : tdata.status === "holt" ? (
                        <FiberManualRecordIcon color="warning" />
                      ) : (
                        <Box display="inline-flex">
                          <Typography style={{marginBottom: 0}}>
                            Live
                            <span 
                              style={{
                                padding: '0.35rem',
                                marginLeft: '0.35rem',
                                position: 'relative',
                                top: '0.8px'
                              }} 
                              className="bg-danger rounded-circle d-inline-block"
                            />
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box style={{
                        top: '0.3rem',
                        position: 'relative',
                        marginLeft: '1.2rem'
                      }}>
                        <SettingsIcon />
                      </Box>
                    </TableCell> 

                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>


      <Dialog open={openUsdzUpload} onClose={handleCloseUsdzUpload} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle>Upload Model</DialogTitle>

          {file ? (
            <>
             <Box 
                id="modelViewerContainer"
                style={{height: '23rem'}}
                dangerouslySetInnerHTML={{
                  __html: `<model-viewer id="modelViewer" style="width: 100%; height: 400px;" ios-src="${file}" ar-modes="scene-viewer webxr" ar autoplay auto-rotate camera-controls></model-viewer>`,
                }}
              />
            </>
          
          ) : (
              <Box {...getRootProps()} className={classes.dropzone}>
                <input {...getInputProps()} />
                <p>Drag and drop your 3D model in .usdz format here, or click to select it.</p>
                <svg style={{opacity: 0.5, width: '51px', height: '51px'}} className="MuiSvgIcon-root MuiDropzoneArea-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>
              </Box>
          ) }

          <DialogActions>
            <MuiButton onClick={handleCloseUsdzUpload} color="primary">
              Cancel
            </MuiButton>
            {/* {
              file &&
              <MuiButton onClick={handleSubmitUsdzUpload} color="primary">
                Submit
              </MuiButton>
            } */}
          </DialogActions>
        </Dialog>
    </>
  );
  






};

export default ProjectTables;
