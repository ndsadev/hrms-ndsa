import React from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";

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
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control
                            type="file"
                            name="profilePicture"
                            onChange={handleFileChange}
                        />
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
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            required
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
                                    onChange={(e) =>
                                        handleSemesterUpload(index, e.target.files)
                                    }
                                />
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
                    <h5>Work Experience</h5>
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
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="startDate"
                                            value={exp.startDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="endDate"
                                            value={exp.endDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Offer Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "offerLetter", e.target.files[0])
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Experience Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "experienceLetter", e.target.files[0])
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Appointment Letter</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "appointmentLetter", e.target.files[0])
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Salary Slip</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                handleExperienceFileUpload(index, "salarySlip", e.target.files[0])
                                            }
                                        />
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
