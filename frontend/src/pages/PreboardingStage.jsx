import React, { useState, useEffect } from "react";
import { Container, Card, ProgressBar, Form, Button } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import PreboardingStageForm from "../components/PreboardingStageForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import usePreboarding from "../hooks/usePreboarding";
import { useDispatch } from "react-redux";


const getInitialFormData = (employee, nameParts) => ({
  employeeId: employee?.employeeId || "",
  profilePic: null,

  firstName: nameParts.firstName,
  middleName: nameParts.middleName,
  lastName: nameParts.lastName,

  dob: "",
  email: employee?.email || "",
  phone: employee?.phone || "",
  bloodGroup: "",
  address: "",

  education: [
    { qualification: "", university: "", passingYear: "", semesterResults: [] },
  ],
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
      experienceLetter: null,
      appointmentLetter: null,
      salarySlip: null,
    },
  ],

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

  emergencyName: "",
  relation: "",
  emergencyPhone: "",
  emergencyAlternatePhone: "",
  emergencyAddress: "",
});


const splitFullName = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      middleName: "",
      lastName: "",
    };
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      middleName: "",
      lastName: parts[1],
    };
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};


const PreboardingStage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state?.employee;
  const nameParts = splitFullName(employee?.name || "");
  const { saveProfile } = usePreboarding();
  const dispatch = useDispatch();


  const [formData, setFormData] = useState(
    getInitialFormData(employee, nameParts)
  );

  const [errors, setErrors] = useState({});

  const totalSteps = 6;
  const percentage = Math.round((step / totalSteps) * 100);

  // common handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  // education
  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updated });
  };

  const handleSemesterUpload = (index, files) => {
    const updated = [...formData.education];

    updated[index] = {
      ...updated[index],
      semesterResults: Array.from(files),
    };

    setFormData({
      ...formData,
      education: updated,
    });
  };

  const addEducation = () =>
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { qualification: "", university: "", passingYear: "", semesterResults: [] },
      ],
    });

  const removeEducation = (index) =>
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });

  // certificate
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

  const addCertification = () =>
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: "", file: null }],
    });

  const removeCertification = (index) =>
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });

  // experience
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

  const addExperience = () =>
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
          experienceLetter: null,
          appointmentLetter: null,
          salarySlip: null,
        },
      ],
    });

  const removeExperience = (index) =>
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index),
    });

  // validation
  const validateStep = () => {
    let stepErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) stepErrors.firstName = "Required";
        if (!formData.lastName) stepErrors.lastName = "Required";
        if (!formData.dob) stepErrors.dob = "Required";
        if (!formData.email) stepErrors.email = "Required";
        if (!formData.phone) stepErrors.phone = "Required";
        break;

      case 2:
        formData.education.forEach((edu, i) => {
          if (!edu.qualification) stepErrors[`edu_${i}`] = "Required";
        });
        break;

      case 3:
        formData.certifications.forEach((c, i) => {
          // agar user ne kuch bhara hi nahi → skip
          if (!c.name && !c.file) return;

          // agar certificate add kiya hai → dono required
          if (!c.name) stepErrors[`cert_${i}`] = "Certificate name required";
          if (!c.file) stepErrors[`cert_file_${i}`] = "Certificate file required";
        });
        break;

      case 5:
        if (!formData.accountHolder) stepErrors.accountHolder = "Required";
        if (!formData.bankName) stepErrors.bankName = "Required";
        if (!formData.accountNo) stepErrors.accountNo = "Required";
        if (!formData.ifsc) stepErrors.ifsc = "Required";
        break;

      case 6:
        if (!formData.emergencyName)
          stepErrors.emergencyName = "Contact Name required.";
        if (!formData.emergencyPhone)
          stepErrors.emergencyPhone = "Contact Phone required.";
        if (!formData.emergencyAlternatePhone)
          stepErrors.emergencyAlternatePhone = "Alternate Phone required.";
        break;

      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
    else toast.warning("Please fill all required fields!");
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const res = await saveProfile(formData);
      if (!res?.success) {
        toast.error("Failed to save preboarding profile");
        return;
      }
      toast.success("Preboarding Profile Saved Successfully!");
      navigate("/dashboard/onboarding");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving profile");
    }
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
          font-size: 22px;
          font-weight: 700;
        }
      `}</style>

      <Container>
        <div className="d-flex justify-content-between align-items-center page-header">
          <h5 className="mb-0 d-flex align-items-center text-white page-title">
            <HiOutlineDocumentArrowUp className="me-2" size={28} /> Employee Profile
          </h5>

          <div style={{ width: 50, height: 50 }}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                textSize: "30px",
                pathColor: "#06406E",
                textColor: "#000",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>

        <ProgressBar now={percentage} className="mb-3" variant="info" animated />

        <Card className="shadow-lg p-4 rounded mb-4">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <PreboardingStageForm
              step={step}
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleEducationChange={handleEducationChange}
              handleSemesterUpload={handleSemesterUpload}
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
            />

            <div className="d-flex justify-content-between mt-4">
              {step > 1 && (
                <Button className="add-company-btn" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < totalSteps && (
                <Button className="add-company-btn" onClick={nextStep}>
                  Next
                </Button>
              )}
              {step === totalSteps && (
                <Button
                  variant="success"
                  type="submit"
                  onClick={() =>
                    setFormData((p) => ({ ...p, __finalSubmit: true }))
                  }
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </Card>

        <ToastContainer />
      </Container>
    </>
  );
};

export default PreboardingStage;
