import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import SummaryApi from "../../common";
import { toast } from "react-toastify";

const useEditEmployee = ({
  selectedEmployee,
  mode,
  onSuccess,
}) => {
  // =========================
  // INITIAL FORM STATE
  // =========================
  const initialFormData = {
    employeeId: "",

    // PERSONAL
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    bloodGroup: "",
    address: "",
    profilePic: null,

    // EDUCATION
    education: [
      {
        qualification: "",
        university: "",
        passingYear: "",
        semesterResults: [],
      },
    ],

    // CERTIFICATION (OPTIONAL)
    certifications: [{ name: "", file: null }],

    // EXPERIENCE (OPTIONAL)
    experiences: [],

    // BANK
    accountHolder: "",
    bankName: "",
    branch: "",
    bankEmail: "",
    bankPhone: "",
    accountNo: "",
    ifsc: "",
    registerNo: "",
    aadharNo: "",
    panNo: "",

    // EMERGENCY
    emergencyName: "",
    relation: "",
    emergencyPhone: "",
    emergencyAlternatePhone: "",
    emergencyAddress: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // =========================
  // PREFILL DATA (EDIT MODE)
  // =========================
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
        education:
          selectedEmployee.education?.length > 0
            ? selectedEmployee.education
            : initialFormData.education,

        // CERTIFICATION
        certifications:
          selectedEmployee.certifications?.length > 0
            ? selectedEmployee.certifications
            : [{ name: "", file: null }],

        // EXPERIENCE
        experiences: selectedEmployee.experiences || [],

        // BANK
        accountHolder: selectedEmployee.bankDetails?.accountHolder || "",
        bankName: selectedEmployee.bankDetails?.bankName || "",
        branch: selectedEmployee.bankDetails?.branch || "",
        bankEmail: selectedEmployee.bankDetails?.bankEmail || "",
        bankPhone: selectedEmployee.bankDetails?.bankPhone || "",
        accountNo: selectedEmployee.bankDetails?.accountNo || "",
        ifsc: selectedEmployee.bankDetails?.ifsc || "",
        registerNo: selectedEmployee.bankDetails?.registerNo || "",
        aadharNo: selectedEmployee.bankDetails?.aadharNo || "",
        panNo: selectedEmployee.bankDetails?.panNo || "",

        // EMERGENCY
        emergencyName: selectedEmployee.emergencyContact?.name || "",
        relation: selectedEmployee.emergencyContact?.relation || "",
        emergencyPhone: selectedEmployee.emergencyContact?.phone || "",
        emergencyAlternatePhone:
          selectedEmployee.emergencyContact?.alternatePhone || "",
        emergencyAddress: selectedEmployee.emergencyContact?.address || "",
      });

      setCurrentStep(1);
    }
  }, [mode, selectedEmployee]);

  // =========================
  // BASIC INPUT HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // =========================
  // EDUCATION HANDLERS
  // =========================
  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updated });
  };

  const handleSemesterUpload = (index, files) => {
    const updated = [...formData.education];
    updated[index].semesterResults = Array.from(files);
    setFormData({ ...formData, education: updated });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { qualification: "", university: "", passingYear: "", semesterResults: [] },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);
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

      // FILES
      if (formData.profilePic instanceof File) {
        fd.append("profilePic", formData.profilePic);
      }

      formData.education.forEach((edu, i) => {
        edu.semesterResults?.forEach((file) => {
          if (file instanceof File) {
            fd.append(`semesterResults_${i}`, file);
          }
        });
      });

      await api.post(SummaryApi.savePreboardingProfile.url, fd);

      toast.success("Profile updated successfully");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EXPORT
  // =========================
  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    saving,

    handleChange,

    handleEducationChange,
    handleSemesterUpload,
    addEducation,
    removeEducation,

    handleSave,
  };
};

export default useEditEmployee;
