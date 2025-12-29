import React from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";

const toDateInputValue = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};


const ViewFile = ({ file, label, isImage = false }) => {
    if (!file) return null;

    // 🔹 Existing uploaded file (Cloudinary)
    if (file.url) {
        return (
            <div className="mt-2">
                {isImage ? (
                    <img
                        src={file.url}
                        alt={label}
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                        }}
                    />
                ) : (
                    <a href={file.url} target="_blank" rel="noreferrer">
                        View {label}
                    </a>
                )}
            </div>
        );
    }

    // 🔹 Newly selected file (before submit)
    if (file instanceof File) {
        const previewUrl = URL.createObjectURL(file);

        return (
            <div className="mt-2">
                {isImage ? (
                    <img
                        src={previewUrl}
                        alt={label}
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                        }}
                    />
                ) : (
                    <span className="text-muted">{file.name}</span>
                )}
            </div>
        );
    }

    return null;
};

const PreboardingStageForm = ({
    step,
    formData,
    handleChange,
    handleFileChange,
    handleEducationChange,
    handleSemesterUpload,
    addEducation,
    removeEducation,
    handleCertificationChange,
    handleCertificationUpload,
    addCertification,
    removeCertification,
    handleExperienceChange,
    handleExperienceFileUpload,
    addExperience,
    removeExperience,
    editMode,
}) => {
    return (
        <>
            {/* Step 1: Personal */}
            {step === 1 && (
                <>
                    <Row className="align-items-center mb-3 justify-content-between">
                        {/* LEFT : TITLE */}
                        <Col xs="auto">
                            <h5 className="mb-0">Personal Details</h5>
                        </Col>

                        {/* RIGHT : EMP ID BADGE */}
                        <Col xs="auto" className="d-flex justify-content-end">
                            {formData?.employeeId && (
                                <div
                                    style={{
                                        background: "#06406ec7",
                                        borderRadius: "24px",
                                        padding: "8px 14px",
                                        width: "216px",
                                        overflow: "hidden",
                                        color: "#fff",
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    {/* FIXED ID CHIP */}
                                    <span
                                        style={{
                                            background: "#043154",
                                            padding: "4px 10px",
                                            borderRadius: "14px",
                                            fontSize: "13px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ID
                                    </span>

                                    {/* MOVING TEXT ONLY */}
                                    <marquee
                                        behavior="scroll"
                                        direction="left"
                                        scrollAmount="5"
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Employee ID : {formData.employeeId}
                                    </marquee>
                                </div>
                            )}
                        </Col>
                    </Row>


                    <Form.Group className="mb-3">
                        <Form.Label className="mb-0">
                            Profile Picture
                        </Form.Label>

                        <div className="d-flex align-items-center gap-3">
                            <Form.Control
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                style={{ width: "340px" }}   // 👈 input chota
                            />

                            {formData.profilePic?.url && (
                                <img
                                    src={formData.profilePic.url}
                                    alt="Profile"
                                    style={{
                                        width: 70,
                                        height: 70,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: "1px solid #ddd",
                                    }}
                                />
                            )}
                        </div>

                    </Form.Group>



                    {/* UPDATED HERE (Full Name removed) */}
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* UPDATED HERE */}

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth*</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Blood Group*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number*</Form.Label>
                        <Form.Control
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
                <>
                    <h5>Education History</h5>
                    {formData.education.map((edu, index) => (
                        <Card key={index} className="p-3 mb-3 shadow-sm">
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Qualification</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="qualification"
                                            value={edu.qualification}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>University / School</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="university"
                                            value={edu.university}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Year of Passing</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="passingYear"
                                            value={edu.passingYear}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-center">
                                    {formData.education.length > 1 && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeEducation(index)}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Semester-wise Results</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    name={`semesterResults_${index}`}
                                    onChange={(e) =>
                                        handleSemesterUpload(index, e.target.files)
                                    }
                                />

                                {/* 👇 EXISTING DOCUMENTS (EDIT MODE) */}
                                {edu.semesterResults?.length > 0 && (
                                    <div className="mt-2">
                                        <small className="text-muted">Uploaded Documents:</small>
                                        <ul className="mb-0">
                                            {edu.semesterResults.map((sr, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={sr.file?.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Semester {sr.semester} – View
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Form.Group>

                        </Card>
                    ))}
                    <Button
                        variant="info"
                        style={{ backgroundColor: "#9a79a0", border: "none", color: "white" }}
                        onClick={addEducation}
                    >
                        + Add More Education
                    </Button>
                </>
            )}

            {/* Step 3: Certifications */}
            {step === 3 && (
                <>
                    <h5>Certifications</h5>
                    {formData.certifications.map((cert, index) => (
                        <Card key={index} className="p-3 mb-3 shadow-sm">
                            <Row>
                                <Col md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Certificate Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={cert.name}
                                            onChange={(e) => handleCertificationChange(index, e)}

                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Certificate</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleCertificationUpload(index, e.target.files[0])
                                            }
                                        />

                                        {/* 👇 EXISTING CERTIFICATE */}
                                        {cert.file?.url && (
                                            <div className="mt-2">
                                                <a
                                                    href={cert.file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Uploaded Certificate
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>

                                </Col>
                                <Col md={2} className="d-flex align-items-center">
                                    {formData.certifications.length > 1 && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeCertification(index)}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    ))}
                    <Button
                        variant="info"
                        style={{ backgroundColor: "#9a79a0", border: "none", color: "white" }}
                        onClick={addCertification}
                    >
                        + Add More Certifications
                    </Button>
                </>
            )}

            {/* Step 4: Work Experience */}
            {step === 4 && (
                <>
                    <h5>
                        Work Experience{" "}
                        <span className="text-muted" style={{ fontSize: "13px" }}>
                            (Optional – Fresher allowed)
                        </span>
                    </h5>
                    {formData.experiences.map((exp, index) => (
                        <Card key={index} className="p-3 mb-3 shadow-sm">
                            <Row>
                                <Col md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="company"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="designation"
                                            value={exp.designation}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2} className="d-flex align-items-center">
                                    {formData.experiences.length > 1 && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeExperience(index)}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Designation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="startDesignation"
                                            value={exp.startDesignation}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Designation</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="endDesignation"
                                            value={exp.endDesignation}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                {/* START DATE */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>

                                        {editMode ? (
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={toDateInputValue(exp.startDate)}
                                                onChange={(e) => handleExperienceChange(index, e)}
                                            />
                                        ) : (
                                            <div className="form-control bg-light">
                                                {exp.startDate
                                                    ? new Date(exp.startDate).toLocaleDateString()
                                                    : "—"}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {/* END DATE */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>

                                        {editMode ? (
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={toDateInputValue(exp.endDate)}
                                                onChange={(e) => handleExperienceChange(index, e)}
                                            />

                                        ) : (
                                            <div className="form-control bg-light">
                                                {exp.endDate
                                                    ? new Date(exp.endDate).toLocaleDateString()
                                                    : "—"}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                {/* OFFER LETTER */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Offer Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "offerLetter", e.target.files[0])
                                            }
                                        />

                                        {exp.offerLetter?.url && (
                                            <div className="mt-2">
                                                <a href={exp.offerLetter.url} target="_blank" rel="noreferrer">
                                                    View Offer Letter
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {/* EXPERIENCE LETTER */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Experience Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "experienceLetter", e.target.files[0])
                                            }
                                        />

                                        {exp.experienceLetter?.url && (
                                            <div className="mt-2">
                                                <a href={exp.experienceLetter.url} target="_blank" rel="noreferrer">
                                                    View Experience Letter
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                {/* APPOINTMENT LETTER */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Appointment Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "appointmentLetter", e.target.files[0])
                                            }
                                        />

                                        {exp.appointmentLetter?.url && (
                                            <div className="mt-2">
                                                <a href={exp.appointmentLetter.url} target="_blank" rel="noreferrer">
                                                    View Appointment Letter
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {/* SALARY SLIP */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Salary Slip</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "salarySlip", e.target.files[0])
                                            }
                                        />

                                        {exp.salarySlip?.url && (
                                            <div className="mt-2">
                                                <a href={exp.salarySlip.url} target="_blank" rel="noreferrer">
                                                    View Salary Slip
                                                </a>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Card>
                    ))}
                    <Button
                        variant="info"
                        style={{ backgroundColor: "#9a79a0", border: "none", color: "white" }}
                        onClick={addExperience}
                    >
                        + Add More Experience
                    </Button>
                </>
            )}

            {/* Step 5: Bank Details */}
            {step === 5 && (
                <>
                    <h5>Bank Details</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Account Holder</Form.Label>
                        <Form.Control
                            type="text"
                            name="accountHolder"
                            value={formData.accountHolder}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Branch</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Id</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="bankEmail"
                                    value={formData.bankEmail}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone No.</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="bankPhone"
                                    value={formData.bankPhone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Account Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="accountNo"
                                    value={formData.accountNo}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifsc"
                                    value={formData.ifsc}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Register No.</Form.Label>
                        <Form.Control
                            type="text"
                            name="registerNo"
                            value={formData.registerNo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Aadhar Card No.</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="aadharNo"
                                    value={formData.aadharNo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Aadhar Card</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="aadharFile"
                                    onChange={handleFileChange}
                                />
                                <ViewFile file={formData.aadharFile} label="Aadhar Card" />

                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>PAN Card No.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="panNo"
                                    value={formData.panNo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload PAN Card</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="panFile"
                                    onChange={handleFileChange}
                                />
                                <ViewFile file={formData.panFile} label="PAN Card" />

                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Cancel Cheque</Form.Label>
                        <Form.Control
                            type="file"
                            name="cancelCheque"
                            onChange={handleFileChange}
                        />
                        <ViewFile file={formData.cancelCheque} label="Cancel Cheque" />

                    </Form.Group>
                </>
            )}

            {/* Step 6: Emergency Contact */}
            {step === 6 && (
                <>
                    <h5>Emergency Contact</h5>

                    <Form.Group className="mb-3">
                        <Form.Label>Contact Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="emergencyName"
                            value={formData.emergencyName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Relation</Form.Label>
                        <Form.Control
                            type="text"
                            name="relation"
                            value={formData.relation}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="number"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Alternate Phone Number</Form.Label>
                        <Form.Control
                            type="number"
                            name="emergencyAlternatePhone"
                            value={formData.emergencyAlternatePhone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="emergencyAddress"
                            value={formData.emergencyAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </>
            )}

        </>
    );
};

export default PreboardingStageForm;
