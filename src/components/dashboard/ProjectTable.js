import Image from "next/image";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

const tableData = [
  {
    avatar: 'https://cdn.qr-code-generator.com/account27679483/qrcodes/69004042.png?Expires=1690949798&Signature=ACaBJ6uHjbnhu9cAeApaJSKY8444DbBFb96yo2GiSEvS2QAC0wRakt2jX8p0KnY8oBMgJx5EsYCwLC-Ws7PHzKfLNq3F44~IQMmwK~jlTSh2fLxOnMT3rAasDSk2EwJ7Pd-QsX82YBPgTPTbYV27hCLwSovM-csrWbGb-PyCqXy0cB5Ynpse7G7c0LUVifxVlI6rr1TIxbrTDasmKGl0cCDGp9Zd95PF5LFloP~genii~UOA40Fb71kAZrcRSMdRFMElprUYurXEKgL0AeLMN2Y0SRGpFV3PpfoD2l2jm-3awB0IrcvKxcAhcNMxClVQn0HQGv9VvtchUc9xPvQk8A__&Key-Pair-Id=KKMPOJU8AYATR',
    name: "Jonathan Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: 'https://cdn.qr-code-generator.com/account27679483/qrcodes/69004042.png?Expires=1690949798&Signature=ACaBJ6uHjbnhu9cAeApaJSKY8444DbBFb96yo2GiSEvS2QAC0wRakt2jX8p0KnY8oBMgJx5EsYCwLC-Ws7PHzKfLNq3F44~IQMmwK~jlTSh2fLxOnMT3rAasDSk2EwJ7Pd-QsX82YBPgTPTbYV27hCLwSovM-csrWbGb-PyCqXy0cB5Ynpse7G7c0LUVifxVlI6rr1TIxbrTDasmKGl0cCDGp9Zd95PF5LFloP~genii~UOA40Fb71kAZrcRSMdRFMElprUYurXEKgL0AeLMN2Y0SRGpFV3PpfoD2l2jm-3awB0IrcvKxcAhcNMxClVQn0HQGv9VvtchUc9xPvQk8A__&Key-Pair-Id=KKMPOJU8AYATR',
    name: "Martin Gover",
    email: "hgover@gmail.com",
    project: "Lading pro React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: 'https://cdn.qr-code-generator.com/account27679483/qrcodes/69004042.png?Expires=1690949798&Signature=ACaBJ6uHjbnhu9cAeApaJSKY8444DbBFb96yo2GiSEvS2QAC0wRakt2jX8p0KnY8oBMgJx5EsYCwLC-Ws7PHzKfLNq3F44~IQMmwK~jlTSh2fLxOnMT3rAasDSk2EwJ7Pd-QsX82YBPgTPTbYV27hCLwSovM-csrWbGb-PyCqXy0cB5Ynpse7G7c0LUVifxVlI6rr1TIxbrTDasmKGl0cCDGp9Zd95PF5LFloP~genii~UOA40Fb71kAZrcRSMdRFMElprUYurXEKgL0AeLMN2Y0SRGpFV3PpfoD2l2jm-3awB0IrcvKxcAhcNMxClVQn0HQGv9VvtchUc9xPvQk8A__&Key-Pair-Id=KKMPOJU8AYATR',
    name: "Gulshan Gover",
    email: "hgover@gmail.com",
    project: "Elite React",
    status: "holt",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: 'https://cdn.qr-code-generator.com/account27679483/qrcodes/69004042.png?Expires=1690949798&Signature=ACaBJ6uHjbnhu9cAeApaJSKY8444DbBFb96yo2GiSEvS2QAC0wRakt2jX8p0KnY8oBMgJx5EsYCwLC-Ws7PHzKfLNq3F44~IQMmwK~jlTSh2fLxOnMT3rAasDSk2EwJ7Pd-QsX82YBPgTPTbYV27hCLwSovM-csrWbGb-PyCqXy0cB5Ynpse7G7c0LUVifxVlI6rr1TIxbrTDasmKGl0cCDGp9Zd95PF5LFloP~genii~UOA40Fb71kAZrcRSMdRFMElprUYurXEKgL0AeLMN2Y0SRGpFV3PpfoD2l2jm-3awB0IrcvKxcAhcNMxClVQn0HQGv9VvtchUc9xPvQk8A__&Key-Pair-Id=KKMPOJU8AYATR',
    name: "Pavar Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: 'https://cdn.qr-code-generator.com/account27679483/qrcodes/69004042.png?Expires=1690949798&Signature=ACaBJ6uHjbnhu9cAeApaJSKY8444DbBFb96yo2GiSEvS2QAC0wRakt2jX8p0KnY8oBMgJx5EsYCwLC-Ws7PHzKfLNq3F44~IQMmwK~jlTSh2fLxOnMT3rAasDSk2EwJ7Pd-QsX82YBPgTPTbYV27hCLwSovM-csrWbGb-PyCqXy0cB5Ynpse7G7c0LUVifxVlI6rr1TIxbrTDasmKGl0cCDGp9Zd95PF5LFloP~genii~UOA40Fb71kAZrcRSMdRFMElprUYurXEKgL0AeLMN2Y0SRGpFV3PpfoD2l2jm-3awB0IrcvKxcAhcNMxClVQn0HQGv9VvtchUc9xPvQk8A__&Key-Pair-Id=KKMPOJU8AYATR',
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Ample React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
];

const ProjectTables = () => {
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
                <th>Project</th>

                <th>Status</th>

                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-4">
                      <img
                        src={tdata.avatar}
                        alt="avatar"
                        width="100"
                        height="100"
                      />
                      {/* <div className="ms-3">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">{tdata.email}</span>
                      </div> */}
                    </div>
                  </td>
                  <td>{tdata.project}</td>
                  <td>
                    {tdata.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                    ) : tdata.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3" />
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                    )}
                  </td>

                  <td>{tdata.budget}</td>
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
