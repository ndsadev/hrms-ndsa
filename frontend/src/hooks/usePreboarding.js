import { useState } from "react";
import api from "../api/axiosInstance";
import SummaryApi from "../common";

const usePreboarding = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // ============================
  // 🔹 GET PREBOARDING PROFILE
  // ============================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        SummaryApi.getPreboardingProfile.url
      );

      setProfile(res.data.data);
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error("❌ Preboarding fetch error:", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 CREATE / UPDATE PROFILE
  // ============================
  const saveProfile = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();

      // =========================
      // SIMPLE FIELDS
      // =========================
      payload.append("employeeId", formData.employeeId);
      payload.append("firstName", formData.firstName);
      payload.append("middleName", formData.middleName || "");
      payload.append("lastName", formData.lastName);
      payload.append("dob", formData.dob);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("bloodGroup", formData.bloodGroup);
      payload.append("address", formData.address);

      // =========================
      // JSON DATA
      // =========================
      payload.append("education", JSON.stringify(formData.education || []));
      payload.append("certifications", JSON.stringify(formData.certifications || []));
      payload.append("experiences", JSON.stringify(formData.experiences || []));

      payload.append(
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

      payload.append(
        "emergencyContact",
        JSON.stringify({
          name: formData.emergencyName,
          relation: formData.relation,
          phone: formData.emergencyPhone,
          alternatePhone: formData.emergencyAlternatePhone,
          address: formData.emergencyAddress,
        })
      );

      // ✅ IMPORTANT: submit flag
    if (formData.__finalSubmit) {
  payload.append("submit", "true");
}


      // =========================
      // FILES
      // =========================

      // Profile Picture
      if (formData.profilePic) {
        payload.append("profilePic", formData.profilePic);
      }

      // Semester Results (PDFs) — INDEX BASED (FIX)
      formData.education?.forEach((edu, index) => {
        if (edu.semesterResults?.length) {
          edu.semesterResults.forEach((file) => {
            payload.append(`semesterResults_${index}`, file);
          });
        }
      });


      // Certification Files
      formData.certifications?.forEach((cert) => {
        if (cert.file) {
          payload.append("certificationFile", cert.file);
        }
      });

      // Experience Files
      formData.experiences?.forEach((exp) => {
        if (exp.offerLetter)
          payload.append("offerLetter", exp.offerLetter);

        if (exp.experienceLetter)
          payload.append("experienceLetter", exp.experienceLetter);

        if (exp.appointmentLetter)
          payload.append("appointmentLetter", exp.appointmentLetter);

        if (exp.salarySlip)
          payload.append("salarySlip", exp.salarySlip);
      });

      // Bank Files
      if (formData.aadharFile)
        payload.append("aadharFile", formData.aadharFile);

      if (formData.panFile)
        payload.append("panFile", formData.panFile);

      if (formData.cancelCheque)
        payload.append("cancelCheque", formData.cancelCheque);

      // =========================
      // API CALL (❌ NO manual headers)
      // =========================
      const res = await api.post(
        SummaryApi.savePreboardingProfile.url,
        payload
      );

      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Preboarding save error:", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profile,
    fetchProfile,
    saveProfile,
  };
};

export default usePreboarding;
