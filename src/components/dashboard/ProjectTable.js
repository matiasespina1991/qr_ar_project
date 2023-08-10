import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { Box } from "@material-ui/core";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import QRCode from "qrcode.react";

const ProjectTables = ({ qrCodesList }) => {
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const inputRef = useRef(null); // Create a ref

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
                    <div style={{paddingLeft: '2.4rem'}}>
                      {tdata.isInteriorModel === true ? (
                        <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                      ) : tdata.isInteriorModel === false ? (
                        <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                      ) : ({})}
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
  );
};

export default ProjectTables;
