import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import {
    startLoading,
    setEmployeeProfile,
    setMode,
    setError,
} from "../store/onboardingSlice";

const useOnboarding = () => {
    const dispatch = useDispatch();
    const { selectedEmployee, loading, mode } = useSelector(
        (state) => state.onboarding
    );

    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    //  Fetch
    const fetchEmployees = async (onError) => {
        try {
            const res = await api.get(SummaryApi.getPreboardingList.url);
            setEmployees(res.data.data);
        } catch (err) {
            onError?.("Failed to load employees");
        }
    };

    //  View
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

    //  Edit
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


    //  Delete
    const deleteEmployee = async (emp, onSuccess, onError) => {
        // Optimistic UI
        setEmployees((prev) => prev.filter((e) => e._id !== emp._id));

        try {
            await api.delete(
                SummaryApi.deletePreboardingProfile.url(emp.employeeId)
            );
            onSuccess?.("Employee deleted successfully");
        } catch {
            onError?.("Delete failed, refreshing...");
            fetchEmployees();
        }
    };

    return {
        employees,
        setEmployees,
        fetchEmployees,
        viewEmployee,
        editEmployee,
        deleteEmployee,
        showModal,
        setShowModal,
        selectedEmployee,
        loading,
        mode,
    };
};

export default useOnboarding;
