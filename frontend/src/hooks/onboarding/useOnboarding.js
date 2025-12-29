import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axiosInstance";
import SummaryApi from "../../common";
import {
  startLoading,
  setEmployeeProfile,
  setMode,
  setError,
} from "../../store/onboardingSlice";

const useOnboarding = () => {
  const dispatch = useDispatch();
  const { selectedEmployee, loading, mode } = useSelector(
    (state) => state.onboarding
  );

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // table loading (blink fix)
  const [listLoading, setListLoading] = useState(true);

  // =============================
  // FETCH EMPLOYEES (TABLE)
  // =============================
  const fetchEmployees = async (onError) => {
    try {
      setListLoading(true);
      const res = await api.get(SummaryApi.getPreboardingList.url);
      setEmployees(res.data.data || []);
    } catch {
      onError?.("Failed to load employees");
    } finally {
      setListLoading(false);
    }
  };

  // =============================
  // VIEW EMPLOYEE
  // =============================
  const viewEmployee = async (emp, onError) => {
    try {
      dispatch(startLoading());
      dispatch(setMode("view"));

      const res = await api.get(
        SummaryApi.getPreboardingProfileByEmployeeId.url(emp.employeeId)
      );

      dispatch(setEmployeeProfile(res.data.data));
      setShowModal(true);
    } catch {
      dispatch(setError("Failed to load profile"));
      onError?.("Failed to load profile");
    }
  };

  // =============================
  // EDIT EMPLOYEE
  // =============================
  const editEmployee = async (emp, onError) => {
    try {
      dispatch(startLoading());
      dispatch(setMode("edit"));

      const res = await api.get(
        SummaryApi.getPreboardingProfileByEmployeeId.url(emp.employeeId)
      );

      dispatch(setEmployeeProfile(res.data.data));
      setShowModal(true);
    } catch {
      dispatch(setError("Failed to load profile"));
      onError?.("Failed to load profile");
    }
  };

  // =============================
  // DELETE EMPLOYEE
  // =============================
  const deleteEmployee = async (emp, onSuccess, onError) => {
    const backup = employees;
    setEmployees((prev) => prev.filter((e) => e._id !== emp._id));

    try {
      await api.delete(
        SummaryApi.deletePreboardingProfile.url(emp.employeeId)
      );
      onSuccess?.("Employee deleted successfully");
    } catch {
      setEmployees(backup);
      onError?.("Delete failed, refreshing...");
      fetchEmployees();
    }
  };

  return {
    employees,
    setEmployees,
    fetchEmployees,

    // TABLE LOADING
    listLoading,

    // actions
    viewEmployee,
    editEmployee,
    deleteEmployee,

    // modal
    showModal,
    setShowModal,

    // redux
    selectedEmployee,
    loading, // modal loading
    mode,
  };
};

export default useOnboarding;
