import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axiosInstance";
import SummaryApi from "../../common";
import {
  startListLoading,
  setEmployees,
  setListError,
  startLoading,
  setEmployeeProfile,
  setMode,
  setError,
  closeModal,            // 🔹 UPDATE 1
} from "../../store/onboardingSlice";

const useOnboarding = () => {
  const dispatch = useDispatch();

  const {
    employees,
    listLoading,
    hasFetched,

    selectedEmployee,
    loading,
    mode,
    showModal,            // 🔹 UPDATE 1
  } = useSelector((state) => state.onboarding);

  /* ================= TABLE ================= */

  const fetchEmployees = async (
  onError,
  { showLoader = true } = {}
) => {
  try {
    if (showLoader) dispatch(startListLoading());

    const res = await api.get(SummaryApi.getPreboardingList.url);
    dispatch(setEmployees(res.data.data || []));
  } catch {
    dispatch(setListError());
    onError?.("Failed to load employees");
  }
};

  /* ================= VIEW ================= */

  const viewEmployee = async (emp, onError) => {
    try {
      dispatch(startLoading());
      dispatch(setMode("view"));

      const res = await api.get(
        SummaryApi.getPreboardingProfileByEmployeeId.url(emp.employeeId)
      );

      dispatch(setEmployeeProfile(res.data.data)); // 🔥 modal opens via slice
    } catch {
      dispatch(setError("Failed to load profile"));
      onError?.("Failed to load profile");
    }
  };

  /* ================= EDIT ================= */

  const editEmployee = async (emp, onError) => {
    try {
      dispatch(startLoading());
      dispatch(setMode("edit"));

      const res = await api.get(
        SummaryApi.getPreboardingProfileByEmployeeId.url(emp.employeeId)
      );

      dispatch(setEmployeeProfile(res.data.data)); // 🔥 modal opens via slice
    } catch {
      dispatch(setError("Failed to load profile"));
      onError?.("Failed to load profile");
    }
  };

  /* ================= DELETE ================= */

  const deleteEmployee = async (emp, onSuccess, onError) => {
    try {
      await api.delete(
        SummaryApi.deletePreboardingProfile.url(emp.employeeId)
      );

      onSuccess?.("Employee deleted successfully");
      fetchEmployees(null, { showLoader: false });
    } catch {
      onError?.("Failed to delete employee");
    }
  };


  return {
    /* ===== table ===== */
    employees,
    listLoading,
    hasFetched,
    fetchEmployees,

    /* ===== modal ===== */
    selectedEmployee,
    loading,
    mode,
    showModal,        // 🔹 UPDATE 1
    closeModal: () => dispatch(closeModal()),

    /* ===== actions ===== */
    viewEmployee,
    editEmployee,
    deleteEmployee,
  };
};

export default useOnboarding;
