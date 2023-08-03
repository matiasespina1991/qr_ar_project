
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";

const ProjectTables = (param) => {

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
                <th>QR Preview</th>

                <th>Preview</th>

                <th>Project Name</th>

                <th>Status</th>

                <th>Settings</th>
              </tr>
            </thead>
            <tbody>
              {param.qrCodesList.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-4">
                      <img
                        src={tdata.qrImageUrl}
                        alt="avatar"
                        width="100"
                        height="100"
                      />
                    </div>
                  </td>
                  <td>{tdata.previewImageUrl ?? 'N/A'}</td>
                  <td>{tdata.projectName}</td>
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
