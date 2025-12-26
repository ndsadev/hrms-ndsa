import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FaUser } from "react-icons/fa";

const PRIMARY = "#06406E";
const SECONDARY = "#9BC092";

const FileLink = ({ file }) => {
  if (!file?.url) return <span className="text-muted">—</span>;

  return (
    <div
      style={{
        border: "1px solid #ced4da",
        borderRadius: "6px",
        padding: "8px 12px",
        background: "#f8f9fa",
        minHeight: "38px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <a
        href={file.url}   // DIRECT URL ONLY
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#06406E",
          fontWeight: 600,
          textDecoration: "underline",
        }}
      >
        View
      </a>
    </div>
  );
};

const EmployeeProfileView = ({ data }) => {
    if (!data) return null;

    const {
        employeeId,
        status,
        personalDetails = {},
        education = [],
        certifications = [],
        experiences = [],
        bankDetails = {},
        emergencyContact = {},
    } = data;

    const labelStyle = {
        color: PRIMARY,
        fontWeight: 600,
        fontSize: "14px",
    };

    const sectionStyle = {
        color: "black",
        padding: "8px 0px",
        marginBottom: "16px",
        fontWeight: 600,
        fontSize: 18,
    };

    const subSectionStyle = {
        background: SECONDARY,
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        marginBottom: "16px",
        fontWeight: 600,
    };

    return (
        <Form className="p-4 border rounded">

           {/* Header */}
            <div
                style={{
                    background: `linear-gradient(90deg, ${PRIMARY}, #043154)`,
                    padding: "18px 20px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                }}
            >
                <Row className="align-items-center">
                    <Col md={9}>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "14px",
                                marginBottom: "6px",
                            }}
                        >
                            EMPLOYEE ID: {employeeId}
                        </div>

                        <h4
                            style={{
                                color: "#fff",
                                fontWeight: 700,
                                marginBottom: "6px",
                            }}
                        >
                            HUMAN RESOURCE MANAGEMENT SYSTEM (HRMS)
                        </h4>

                        <div style={{ color: "#E6F0F7", fontSize: "14px" }}>
                            Status: <strong>{status || "—"}</strong>
                        </div>
                    </Col>

                    <Col md={3} className="text-end">
                        <div
                            style={{
                                background: "#ffffff",
                                padding: "8px",
                                borderRadius: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {personalDetails?.profilePic?.url ? (
                                <img
                                    src={personalDetails.profilePic.url}
                                    alt="profile"
                                    height={90}
                                    style={{ borderRadius: "6px" }}
                                />
                            ) : (
                                <FaUser size={50} color={PRIMARY} />
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            <div style={subSectionStyle}>EMPLOYEE INFORMATION FORM</div>

            {/* Personal details */}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Personal Details</u>
            </div>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Label style={labelStyle}>First Name</Form.Label>
                    <Form.Control value={personalDetails.firstName || ""} readOnly />
                </Col>
                <Col md={4}>
                    <Form.Label style={labelStyle}>Middle Name</Form.Label>
                    <Form.Control value={personalDetails.middleName || ""} readOnly />
                </Col>
                <Col md={4}>
                    <Form.Label style={labelStyle}>Last Name</Form.Label>
                    <Form.Control value={personalDetails.lastName || ""} readOnly />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Date of Birth</Form.Label>
                    <Form.Control value={personalDetails.dob || ""} readOnly />
                </Col>
                <Col md={6}>
                    <Form.Label style={labelStyle}>Blood Group</Form.Label>
                    <Form.Control value={personalDetails.bloodGroup || ""} readOnly />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Email</Form.Label>
                    <Form.Control value={personalDetails.email || ""} readOnly />
                </Col>
                <Col md={6}>
                    <Form.Label style={labelStyle}>Phone</Form.Label>
                    <Form.Control value={personalDetails.phone || ""} readOnly />
                </Col>
            </Row>

            <Form.Group className="mb-4">
                <Form.Label style={labelStyle}>Address</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={personalDetails.address || ""}
                    readOnly
                />
            </Form.Group>

            {/* education */}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Education Details</u>
            </div>

            {education.length ? (
                education.map((edu, i) => (
                    <div key={i} className="mb-3">
                        <Row className="mb-2">
                            <Col md={4}>
                                <Form.Label style={labelStyle}>Qualification</Form.Label>
                                <Form.Control value={edu.qualification || ""} readOnly />
                            </Col>
                            <Col md={4}>
                                <Form.Label style={labelStyle}>University / School</Form.Label>
                                <Form.Control value={edu.university || ""} readOnly />
                            </Col>
                            <Col md={4}>
                                <Form.Label style={labelStyle}>Passing Year</Form.Label>
                                <Form.Control value={edu.passingYear || ""} readOnly />
                            </Col>
                        </Row>

                        <Form.Label style={labelStyle}>Semester Results</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={
                                edu.semesterResults?.length
                                    ? edu.semesterResults
                                        .map((_, idx) => `Semester ${idx + 1}`)
                                        .join(", ")
                                    : "—"
                            }
                            readOnly
                        />
                    </div>
                ))
            ) : (
                <Form.Control value="No education records" readOnly />
            )}

            {/* certifications */}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Certifications</u>
            </div>

            {certifications.length ? (
                certifications.map((c, i) => (
                    <Row key={i} className="mb-3">
                        <Col md={6}>
                            <Form.Label style={labelStyle}>Certificate Name</Form.Label>
                            <Form.Control value={c.name || ""} readOnly />
                        </Col>
                        <Col md={6}>
                            <Form.Label style={labelStyle}>Document</Form.Label>
                            <Form.Control value={c.file?.url ? "Uploaded" : "—"} readOnly />
                        </Col>
                    </Row>
                ))
            ) : (
                <Form.Control value="No certifications" readOnly />
            )}

            {/* experience */}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Work Experience</u>
            </div>

            {experiences.length ? (
                experiences.map((exp, i) => (
                    <div key={i} className="mb-4 p-3 border rounded">

                        {/* Row 1 */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label style={labelStyle}>Company</Form.Label>
                                <Form.Control value={exp.company || ""} readOnly />
                            </Col>

                            <Col md={6}>
                                <Form.Label style={labelStyle}>Designation</Form.Label>
                                <Form.Control value={exp.designation || ""} readOnly />
                            </Col>
                        </Row>

                        {/* Row 2 */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label style={labelStyle}>Start Designation</Form.Label>
                                <Form.Control value={exp.startDesignation || ""} readOnly />
                            </Col>

                            <Col md={6}>
                                <Form.Label style={labelStyle}>End Designation</Form.Label>
                                <Form.Control value={exp.endDesignation || ""} readOnly />
                            </Col>
                        </Row>

                        {/* Row 3 */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label style={labelStyle}>Start Date</Form.Label>
                                <Form.Control
                                    value={
                                        exp.startDate
                                            ? new Date(exp.startDate).toLocaleDateString()
                                            : ""
                                    }
                                    readOnly
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label style={labelStyle}>End Date</Form.Label>
                                <Form.Control
                                    value={
                                        exp.endDate
                                            ? new Date(exp.endDate).toLocaleDateString()
                                            : ""
                                    }
                                    readOnly
                                />
                            </Col>
                        </Row>

                        {/* Row 4 – DOCUMENT LINKS */}
                        <Row className="mb-2">
                            <Col md={3}>
                                <Form.Label style={labelStyle}>Offer Letter</Form.Label>
                                <div><FileLink file={exp.offerLetter} /></div>
                            </Col>

                            <Col md={3}>
                                <Form.Label style={labelStyle}>Appointment Letter</Form.Label>
                                <div><FileLink file={exp.appointmentLetter} /></div>
                            </Col>

                            <Col md={3}>
                                <Form.Label style={labelStyle}>Experience Letter</Form.Label>
                                <div><FileLink file={exp.experienceLetter} /></div>
                            </Col>

                            <Col md={3}>
                                <Form.Label style={labelStyle}>Salary Slip</Form.Label>
                                <div><FileLink file={exp.salarySlip} /></div>
                            </Col>
                        </Row>
                    </div>
                ))
            ) : (
                <Form.Control value="Fresher / No Experience" readOnly />
            )}



            {/* Bank*/}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Bank Details</u>
            </div>

            {/* Row 1 */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Account Holder</Form.Label>
                    <Form.Control value={bankDetails.accountHolder || ""} readOnly />
                </Col>

                <Col md={6}>
                    <Form.Label style={labelStyle}>Bank Name</Form.Label>
                    <Form.Control value={bankDetails.bankName || ""} readOnly />
                </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Branch</Form.Label>
                    <Form.Control value={bankDetails.branch || ""} readOnly />
                </Col>

                <Col md={6}>
                    <Form.Label style={labelStyle}>Bank Email</Form.Label>
                    <Form.Control value={bankDetails.bankEmail || ""} readOnly />
                </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Bank Phone</Form.Label>
                    <Form.Control value={bankDetails.bankPhone || ""} readOnly />
                </Col>

                <Col md={6}>
                    <Form.Label style={labelStyle}>Register Number</Form.Label>
                    <Form.Control value={bankDetails.registerNo || ""} readOnly />
                </Col>
            </Row>

            {/* Row 4 */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Account Number</Form.Label>
                    <Form.Control value={bankDetails.accountNo || ""} readOnly />
                </Col>

                <Col md={6}>
                    <Form.Label style={labelStyle}>IFSC Code</Form.Label>
                    <Form.Control value={bankDetails.ifsc || ""} readOnly />
                </Col>
            </Row>

            {/* Row 5 */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Aadhaar Number</Form.Label>
                    <Form.Control value={bankDetails.aadharNo || ""} readOnly />
                </Col>

                <Col md={6}>
                    <Form.Label style={labelStyle}>PAN Number</Form.Label>
                    <Form.Control value={bankDetails.panNo || ""} readOnly />
                </Col>
            </Row>

            {/* Row 6 – FILE STATUS */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Label style={labelStyle}>Aadhaar Card</Form.Label>
                    <Form.Control
                        value={bankDetails.aadharFile ? "Uploaded" : "—"}
                        readOnly
                    />
                </Col>

                <Col md={4}>
                    <Form.Label style={labelStyle}>PAN Card</Form.Label>
                    <Form.Control
                        value={bankDetails.panFile ? "Uploaded" : "—"}
                        readOnly
                    />
                </Col>

                <Col md={4}>
                    <Form.Label style={labelStyle}>Cancelled Cheque</Form.Label>
                    <Form.Control
                        value={bankDetails.cancelCheque ? "Uploaded" : "—"}
                        readOnly
                    />
                </Col>
            </Row>


            {/* emergency contact details */}
            <div style={sectionStyle}>
                <u style={{ textUnderlineOffset: "6px" }}>Emergency Contact</u>
            </div>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Name</Form.Label>
                    <Form.Control
                        value={emergencyContact.name || ""}
                        readOnly
                    />
                </Col>
                <Col md={6}>
                    <Form.Label style={labelStyle}>Relation</Form.Label>
                    <Form.Control value={emergencyContact.relation || ""} readOnly />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Label style={labelStyle}>Phone</Form.Label>
                    <Form.Control
                        value={emergencyContact.phone || ""}
                        readOnly
                    />
                </Col>
                <Col md={6}>
                    <Form.Label style={labelStyle}>Alternate Phone</Form.Label>
                    <Form.Control
                        value={emergencyContact.alternatePhone || ""}
                        readOnly
                    />
                </Col>
            </Row>

            <Form.Group>
                <Form.Label style={labelStyle}>Address</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={emergencyContact.address || ""}
                    readOnly
                />
            </Form.Group>
        </Form>
    );
};

export default EmployeeProfileView;
