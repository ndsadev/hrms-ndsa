import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container, Form } from "react-bootstrap";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileForm from "../components/PreboardingStageForm";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Onboarding = () => {
    const initialFormData = {
        fullName: "",
        dob: "",
        bloodGroup: "",
        email: "",
        phone: "",
        address: "",
        profilePicture: null,
        education: [{ qualification: "", university: "", passingYear: "", semesterFiles: [] }],
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

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState(initialFormData.uploadDocuments);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get(
                SummaryApi.getPreboardingList.url
            );

            setEmployees(res.data.data); // backend array
        } catch (error) {
            console.error(error);
            toast.error("Failed to load employees");
        }
    };


    const handleDelete = (id) => {
        if (window.confirm("⚠️ Delete this employee?")) {
            setEmployees(employees.filter((emp) => emp.id !== id));
            toast.error("🗑️ Employee deleted!");
        }
    };

    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setFormData(employee.data || initialFormData);
        setEditMode(false); // View mode
        setShowModal(true);
        setCurrentStep(1);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setFormData(employee.data || initialFormData);
        setEditMode(true); // Edit mode
        setShowModal(true);
        setCurrentStep(1);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleNestedChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        if (selectedEmployee) {
            const updated = employees.map((emp) =>
                emp.id === selectedEmployee.id
                    ? { ...emp, data: formData, name: formData.fullName, email: formData.email }
                    : emp
            );
            setEmployees(updated);
            toast.success("✅ Employee updated!");
        } else {
            const newEmp = { id: Date.now(), name: formData.fullName, email: formData.email, data: formData };
            setEmployees([...employees, newEmp]);
            toast.success("✅ Employee added!");
        }
        setShowModal(false);
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

                <div style={{ borderRadius: "12px", border: "1px solid #ddd", overflowX: "auto" }}>
                    <div className="users-card">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Upload Documents</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <tr key={emp._id}>
                                            <td>{emp.employeeId}</td>
                                            <td>{emp.name || "—"}</td>
                                            <td>{emp.email || "—"}</td>

                                            {/* Upload Documents */}
                                            <td>
                                                <HiOutlineDocumentArrowUp
                                                    size={22}
                                                    className="doc-icon"
                                                    title="Upload Documents"
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setUploadData(
                                                            emp.uploadDocuments || initialFormData.uploadDocuments
                                                        );
                                                        setShowUploadModal(true);
                                                    }}
                                                />
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span
                                                    className={`badge ${emp.status === "SUBMITTED"
                                                        ? "bg-warning"
                                                        : emp.status === "VERIFIED"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                        }`}
                                                >
                                                    {emp.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="action-group">
                                                    {/* View */}
                                                    <button
                                                        className="action-btn view-btn"
                                                        title="View Profile"
                                                        onClick={() => handleView(emp)}
                                                    >
                                                        <FaEye size={14} />
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        className="action-btn edit-btn"
                                                        title="Edit Profile"
                                                        onClick={() => handleEdit(emp)}
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        className="action-btn delete-btn"
                                                        title="Delete Profile"
                                                        onClick={() => handleDelete(emp._id)}
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: 20 }}>
                                            No Employees Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </div>

                {/* View/Edit Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? "Edit Employee" : "Employee Details"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedEmployee && (
                            <ProfileForm
                                step={currentStep}
                                formData={formData}
                                handleChange={handleChange}
                                handleNestedChange={handleNestedChange}
                                editMode={editMode} // true = editable, false = read-only
                            />
                        )}

                        <div className="d-flex justify-content-between mt-3">
                            {currentStep > 1 && (
                                <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                                    Previous
                                </Button>
                            )}
                            {currentStep < 7 && (
                                <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {editMode ? (
                            <>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="success" onClick={handleSave}>
                                    Save
                                </Button>
                            </>
                        ) : (
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
