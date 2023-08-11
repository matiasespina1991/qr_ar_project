import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Table, Button } from "reactstrap";
import { doc, updateDoc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import QRCode from "qrcode.react";
import { Dialog, DialogTitle, DialogActions, Button as MuiButton, makeStyles, Box, CircularProgress } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebaseConfig'


const useStyles = makeStyles((theme) => ({
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
}));

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

  const classes = useStyles();

  const db = getFirestore();

  const onDrop = useCallback((acceptedFiles) => {
    setAcceptedFilesState(acceptedFiles)
    const fileObject = acceptedFiles[0];
    setFile(URL.createObjectURL(fileObject));
    
  }, []);

  useEffect(() => {
    if(progress === 100) {
      setProgress(0);
    }
  }, [progress]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.usdz' });


  const uploadFileToFirebase = async (files) => {
    for (const _file of files) {
      const timestampInSeconds = Math.floor(Date.now() / 1000);
      const originalFileName = _file.name.split('.').slice(0, -1).join('.'); 
      const originalFileExtension = _file.name.split('.').pop(); 
      const newFileName = `${originalFileName}-${timestampInSeconds}.${originalFileExtension}`; 
      const storageRef = ref(storage, `usdzFiles/general/${newFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, _file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
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

          setFile(null);
          setDocId(null);
          setAcceptedFilesState([]);
          
          
        }
      );
    }
  };


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
    setDocId(id); // Store the doc id
  };


  const handleCloseUsdzUpload = () => {
    setOpenUsdzUpload(false);
  };
  

  const handleSubmitUsdzUpload = async () => {
    if (file) {
      await uploadFileToFirebase(acceptedFilesState); // Upload the file
    }
    setOpenUsdzUpload(false); // Close the dialog
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


  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">QR Codes</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the QR codes
          </CardSubtitle>
          <div className="table-responsive">
            <Table className="text-nowrap mt-2 align-middle" borderless>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '2.4rem' }}>QR Preview</th>

                  <th style={{ paddingLeft: '1.5rem' }}>Preview</th>

                  <th>Project Name</th>

                  <th>Formats</th>

                  <th>is Interior Model</th>

                  <th>Status</th>

                  <th>Settings</th>
                </tr>
              </thead>

              <tbody>

                {qrCodesList && qrCodesList.map((tdata, index) => (
                  <tr key={tdata.id} className="border-top">

                    <td>
                      {/* <div className="d-flex align-items-center p-4">
                        <img
                          src={tdata.qrImageUrl}
                          alt="avatar"
                          width="100"
                          height="100"
                        />
                      </div> */}

                      <div className="d-flex align-items-center p-4">
                        <a href={tdata.qrUrl} target="_blank" rel="noopener noreferrer">
                          <QRCode id="qr-code-el" value={tdata.qrUrl} size={105} includeMargin={true} />
                        </a>
                      </div>
                    </td>
                    <td>
                      {
                        tdata.modelPreviewImageUrl ? 
                        <img 
                          style={{objectFit: 'cover',
                          objectPosition: 'center center',
                          width: '6rem',
                          height: '6rem'}}
                          src={tdata.modelPreviewImageUrl}
                        />
                        :
                        'N/A'
                      }
                    </td>
                    <td style={{maxWidth: '15rem'}}>
                      <div>
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
                          <span onClick={() => handleEdit(tdata.id, tdata.projectName)}>
                            {tdata.projectName}
                          </span>
                        )}
                        {
                          tdata._debug_comments && (
                            <div style={{ 
                              maxWidth: '100%', // This can be adjusted based on your requirements
                              wordWrap: 'break-word' // This allows the text to break onto the next line
                            }}>
                              <p style={{ fontSize: 13, color: 'grey', textWrap: 'wrap' }}>
                                ( {tdata._debug_comments} )
                              </p>
                            </div>
                          )
                        }


                      </div>
                      
                    </td>
                    <td>
                      <div style={{display: 'inline-flex', flexDirection: 'column', transform: 'scale(0.9)'}}>
                        <div style={{display: 'inline-flex', marginLeft: '0.63rem'}}>
                          <p style={{marginBottom: 0, display: 'content'}}>
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
                          </p>
                        </div>

                        <div style={{display: 'inline-flex', alignItems: 'center'}}>
                          <Button onClick={() => handleClickUsdzUpload(tdata.id)} style={{background: 'transparent', border: 'none', padding: 'unset', color: '#000000db'}}>
                            <div style={{ display: 'inline-flex' }}>
                              <p style={{ marginBottom: 0, display: 'content' }}>
                                usdz
                                <span
                                  style={{
                                    padding: '0.35rem',
                                    marginLeft: '0.35rem',
                                    position: 'relative',
                                    top: '0.8px'
                                  }}
                                  className={`${tdata.usdzUrl ? 'bg-success' : 'bg-danger'} rounded-circle d-inline-block`}
                                />
                              </p>
                            </div>
                          </Button>
                  
                          {
                            tdata.id == docId && progress ?
                            (
                              <CircularProgress variant="determinate" style={{marginLeft: 2.5}} size={11} thickness={9}  value={progress} color='primary' />
                            )
                            :
                            (
                              <></>
                            )
                          }
                        </div>

                      </div>
                    </td>
                    <td>
                      <div style={{ paddingLeft: '2.4rem' }}>
                        <button
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => toggleInteriorModel(tdata.id)}
                        >
                          {tdata.isInteriorModel === true ? (
                            <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                          ) : tdata.isInteriorModel === false ? (
                            <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                          ) : null}
                        </button>
                      </div>
                    </td>
                    <td>
                      {tdata.status === "pending" ? (
                        <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                      ) : tdata.status === "holt" ? (
                        <span className="p-2 bg-warning rounded-circle d-inline-block ms-3" />
                      ) : (
                        <div style={{display: 'inline-flex'}}>
                          <p style={{marginBottom: 0, display: 'content'}}>
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
                          </p>
                        </div>
                        )}
                    </td>

                    <td>
                      <h5 style={{
                        top: '0.3rem',
                        position: 'relative',
                        marginLeft: '1.2rem'
                      }}>
                        <i style={{}} className="bi bi-gear-fill"></i>
                      </h5>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
      <Box>
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
            {
              file &&
              <MuiButton onClick={handleSubmitUsdzUpload} color="primary">
                Submit
              </MuiButton>
            }
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ProjectTables;
