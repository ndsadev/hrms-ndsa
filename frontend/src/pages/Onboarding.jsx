import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container, Form } from "react-bootstrap";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreboardingStageForm from "../components/PreboardingStageForm";
import EmployeeProfileView from "../components/EmployeeProfileView";
import useOnboarding from "../hooks/onboarding/useOnboarding";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import OnboardingTable from "../components/OnboardingTable";

const Onboarding = () => {
    const initialFormData = {
        fullName: "",
        dob: "",
        bloodGroup: "",
        email: "",
        phone: "",
        address: "",
        profilePicture: null,
        education: [{ qualification: "", university: "", passingYear: "", semesterResults: [] }],
        certifications: [{ name: "", file: null }],
        experiences: [
            {
                company: "",
                designation: "",
                startDesignation: "",
                endDesignation: "",
                startDate: "",
                endDate: "",
                offerLetter: null,
                appointmentLetter: null,
                experienceLetter: null,
                salarySlip: null,
            },
        ],
        bankDetails: {
            accountHolder: "",
            bankName: "",
            branch: "",
            bankEmail: "",
            bankPhone: "",
            accountNo: "",
            ifsc: "",
            registerNo: "",
            aadharNo: "",
            aadharFile: null,
            panNo: "",
            panFile: null,
            cancelCheque: null,
        },
        emergencyDetail: {
            employeeName: "",
            emailId: "",
            officialContact: "",
            relationToEmployee: "",
            contactPersonName: "",
            contactPersonNumber: "",
            joiningDate: "",
            educationalQualification: "",
            passOutYear: "",
            bloodGroup: "",
            medicalConditions: "",
            permanentAddress: "",
            designation: "",
            aadhaarCard: null,
            panCard: null,
        },
        visibility: "Private",
        uploadDocuments: {
            offerLetter: null,
            appointmentLetter: null,
            employmentContract: null,
            uploadDate: "",
            visibility: "Private",
        },
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState(initialFormData.uploadDocuments);
    const {
        employees,
        fetchEmployees,
        viewEmployee,
        editEmployee,
        deleteEmployee,
        showModal,
        setShowModal,
        selectedEmployee,
        loading,
        mode,
        listLoading,
    } = useOnboarding();


    useEffect(() => {
        fetchEmployees((msg) => toast.error(msg));
    }, []);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEducationFileUpload = (eduIndex, files) => {
        const updatedEducation = [...formData.education];

        updatedEducation[eduIndex] = {
            ...updatedEducation[eduIndex],
            semesterResults: Array.from(files)
        };

        setFormData({
            ...formData,
            education: updatedEducation,
        });
    };


    const handleNestedChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        try {
            const fd = new FormData();

            // BASIC
            fd.append("employeeId", formData.employeeId);
            fd.append("firstName", formData.firstName);
            fd.append("middleName", formData.middleName || "");
            fd.append("lastName", formData.lastName);
            fd.append("dob", formData.dob);
            fd.append("email", formData.email);
            fd.append("phone", formData.phone);
            fd.append("bloodGroup", formData.bloodGroup);
            fd.append("address", formData.address);

            // JSON
            fd.append("education", JSON.stringify(formData.education));
            fd.append("certifications", JSON.stringify(formData.certifications));
            fd.append("experiences", JSON.stringify(formData.experiences));

            fd.append(
                "bankDetails",
                JSON.stringify({
                    accountHolder: formData.accountHolder,
                    bankName: formData.bankName,
                    branch: formData.branch,
                    bankEmail: formData.bankEmail,
                    bankPhone: formData.bankPhone,
                    accountNo: formData.accountNo,
                    ifsc: formData.ifsc,
                    registerNo: formData.registerNo,
                    aadharNo: formData.aadharNo,
                    panNo: formData.panNo,
                })
            );

            fd.append(
                "emergencyContact",
                JSON.stringify({
                    name: formData.emergencyName,
                    relation: formData.relation,
                    phone: formData.emergencyPhone,
                    alternatePhone: formData.emergencyAlternatePhone,
                    address: formData.emergencyAddress,
                })
            );

            fd.append("submit", "true");

            // FILES (optional)
            if (formData.profilePic) fd.append("profilePic", formData.profilePic);

            formData.education.forEach((edu, i) => {
                edu.semesterResults?.forEach((file) => {
                    if (file instanceof File) {
                        fd.append(`semesterResults_${i}`, file);
                    }
                });
            });

            formData.certifications.forEach((c) => {
                if (c.file instanceof File) {
                    fd.append("certificationFile", c.file);
                }
            });

            formData.experiences.forEach((e) => {
                if (e.offerLetter instanceof File) fd.append("offerLetter", e.offerLetter);
                if (e.experienceLetter instanceof File)
                    fd.append("experienceLetter", e.experienceLetter);
                if (e.appointmentLetter instanceof File)
                    fd.append("appointmentLetter", e.appointmentLetter);
                if (e.salarySlip instanceof File) fd.append("salarySlip", e.salarySlip);
            });

            if (formData.aadharFile instanceof File)
                fd.append("aadharFile", formData.aadharFile);
            if (formData.panFile instanceof File)
                fd.append("panFile", formData.panFile);
            if (formData.cancelCheque instanceof File)
                fd.append("cancelCheque", formData.cancelCheque);

            const res = await api.post(
                SummaryApi.savePreboardingProfile.url,
                fd
            );

            toast.success("Profile updated successfully");
            setShowModal(false);
            fetchEmployees();
        } catch (err) {
            console.error(err);
            toast.error("❌ Update error");
        }
    };


    const handleUploadChange = (e) => {
        const { name, files, value } = e.target;
        if (files) {
            setUploadData({ ...uploadData, [name]: files[0] });
        } else {
            setUploadData({ ...uploadData, [name]: value });
        }
    };

    const handleUploadSave = () => {
        const updated = employees.map((emp) =>
            emp.id === selectedEmployee.id
                ? { ...emp, data: { ...emp.data, uploadDocuments: uploadData } }
                : emp
        );
        setEmployees(updated);
        setShowUploadModal(false);
        toast.success("📄 Documents uploaded successfully!");
    };

    const handleEducationChange = (index, e) => {
        const updated = [...formData.education];
        updated[index][e.target.name] = e.target.value;
        setFormData({ ...formData, education: updated });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { qualification: "", university: "", passingYear: "", semesterResults: [] },
            ],
        });
    };

    const removeEducation = (index) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        });
    };

    const handleCertificationChange = (index, e) => {
        const updated = [...formData.certifications];
        updated[index][e.target.name] = e.target.value;
        setFormData({ ...formData, certifications: updated });
    };

    const handleCertificationUpload = (index, file) => {
        const updated = [...formData.certifications];
        updated[index].file = file;
        setFormData({ ...formData, certifications: updated });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, { name: "", file: null }],
        });
    };

    const removeCertification = (index) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index),
        });
    };

    const handleExperienceChange = (index, e) => {
        const updated = [...formData.experiences];
        updated[index][e.target.name] = e.target.value;
        setFormData({ ...formData, experiences: updated });
    };

    const handleExperienceFileUpload = (index, field, file) => {
        const updated = [...formData.experiences];
        updated[index][field] = file;
        setFormData({ ...formData, experiences: updated });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experiences: [
                ...formData.experiences,
                {
                    company: "",
                    designation: "",
                    startDesignation: "",
                    endDesignation: "",
                    startDate: "",
                    endDate: "",
                    offerLetter: null,
                    appointmentLetter: null,
                    experienceLetter: null,
                    salarySlip: null,
                },
            ],
        });
    };

    const removeExperience = (index) => {
        setFormData({
            ...formData,
            experiences: formData.experiences.filter((_, i) => i !== index),
        });
    };

    useEffect(() => {
        if (mode === "edit" && selectedEmployee) {
            setFormData({
                employeeId: selectedEmployee.employeeId,

                // PERSONAL
                firstName: selectedEmployee.personalDetails?.firstName || "",
                middleName: selectedEmployee.personalDetails?.middleName || "",
                lastName: selectedEmployee.personalDetails?.lastName || "",
                dob: selectedEmployee.personalDetails?.dob?.slice(0, 10) || "",
                email: selectedEmployee.personalDetails?.email || "",
                phone: selectedEmployee.personalDetails?.phone || "",
                bloodGroup: selectedEmployee.personalDetails?.bloodGroup || "",
                address: selectedEmployee.personalDetails?.address || "",
                profilePic: selectedEmployee.personalDetails?.profilePic || null,

                // EDUCATION
                education: selectedEmployee.education || [],

                // CERTIFICATION
                certifications: selectedEmployee.certifications || [],

                // EXPERIENCE
                experiences: selectedEmployee.experiences || [],

                // BANK
                ...selectedEmployee.bankDetails,

                // EMERGENCY
                emergencyName: selectedEmployee.emergencyContact?.name || "",
                relation: selectedEmployee.emergencyContact?.relation || "",
                emergencyPhone: selectedEmployee.emergencyContact?.phone || "",
                emergencyAlternatePhone:
                    selectedEmployee.emergencyContact?.alternatePhone || "",
                emergencyAddress: selectedEmployee.emergencyContact?.address || "",
            });

            setCurrentStep(1); // 👈 IMPORTANT (next/prev fix)
        }
    }, [mode, selectedEmployee]);


    return (
        <>
            <style>{`
  .page-header {
    background: #70a664a1;
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    margin-bottom: 18px;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 22px;
    font-weight: 700;
  }

  .users-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 25px rgba(0,0,0,0.08);
    overflow-x: auto;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table thead {
    background: #06406e;
    color: white;
  }

  .users-table th,
  .users-table td {
    padding: 9px 14px;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
    white-space: nowrap;
  }

  .doc-icon {
    cursor: pointer;
    color: #6c63ff;
  }

  .action-group {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .action-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .view-btn {
    background: #cadffb;
    color: #0d6efd;
  }

  .edit-btn {
  background: #d4f8dd;
    color: #198754;
  }

  .delete-btn {
    background: #fde2e2;
    color: #dc3545;
  }
`}</style>

            <Container>
                <div className="d-flex justify-content-between align-items-center page-header flex-wrap gap-2">
                    <h5 className="mb-0 d-flex align-items-center text-white page-title">
                        <HiOutlineDocumentArrowUp className="me-2" size={28} /> Employee Data
                    </h5>
                </div>

                <OnboardingTable
                    employees={employees}
                    listLoading={listLoading}
                    onView={viewEmployee}
                    onEdit={editEmployee}
                    onDelete={deleteEmployee}
                    onUploadClick={(emp) => {
                        setUploadData(emp.uploadDocuments || initialFormData.uploadDocuments);
                        setShowUploadModal(true);
                    }}
                />

                {/* View/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                    <Modal.Header closeButton>

                        <Modal.Title>
                            {mode === "edit" ? "Edit Employee" : "Employee Details"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loading ? (
                            <div className="text-center py-5">Loading...</div>
                        ) : mode === "view" ? (
                            <EmployeeProfileView data={selectedEmployee} />
                        ) : (
                            <PreboardingStageForm
                                step={currentStep}
                                formData={formData}
                                errors={{}}
                                handleChange={handleChange}
                                handleFileChange={handleChange}
                                handleEducationChange={handleEducationChange}
                                handleSemesterUpload={handleEducationFileUpload}
                                addEducation={addEducation}
                                removeEducation={removeEducation}
                                handleCertificationChange={handleCertificationChange}
                                handleCertificationUpload={handleCertificationUpload}
                                addCertification={addCertification}
                                removeCertification={removeCertification}
                                handleExperienceChange={handleExperienceChange}
                                handleExperienceFileUpload={handleExperienceFileUpload}
                                addExperience={addExperience}
                                removeExperience={removeExperience}
                                editMode={mode === "edit"}
                            />
                        )}
                    </Modal.Body>

                    <Modal.Footer className="justify-content-between">
                        {mode === "edit" && (
                            <>
                                {currentStep > 1 && (
                                    <Button variant="secondary" onClick={() => setCurrentStep(p => p - 1)}>
                                        Previous
                                    </Button>
                                )}

                                {currentStep < 6 && (
                                    <Button variant="primary" onClick={() => setCurrentStep(p => p + 1)}>
                                        Next
                                    </Button>
                                )}

                                {currentStep === 6 && (
                                    <Button variant="success" onClick={handleSave}>
                                        Update
                                    </Button>
                                )}
                            </>
                        )}

                        {mode === "view" && (
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Upload Documents Modal */}
                <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Documents for {selectedEmployee?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Offer Letter</Form.Label>
                                <Form.Control type="file" name="offerLetter" onChange={handleUploadChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Appointment Letter</Form.Label>
                                <Form.Control type="file" name="appointmentLetter" onChange={handleUploadChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Employment Contract</Form.Label>
                                <Form.Control type="file" name="employmentContract" onChange={handleUploadChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Date</Form.Label>
                                <Form.Control type="date" name="uploadDate" value={uploadData.uploadDate} onChange={handleUploadChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Visibility</Form.Label>
                                <Form.Select name="visibility" value={uploadData.visibility} onChange={handleUploadChange}>
                                    <option value="Private">Private</option>
                                    <option value="Public">Public</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleUploadSave}>
                            Save Documents
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer position="top-right" autoClose={2500} />
            </Container>
        </>
    );
};

export default Onboarding;
