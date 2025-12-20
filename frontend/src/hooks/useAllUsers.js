import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import {
  setAllUsers,
  setAllUsersLoading,
  setAllUsersError,
} from "../store/allUsersSlice";

const useAllUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.allUsers);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ======================
  // 🔥 FETCH ALL USERS
  // ======================
const fetchAllUsers = async () => {
  try {
    if (users.length === 0) {
      dispatch(setAllUsersLoading(true));
    }

    const res = await api({
      url: SummaryApi.getAllUsers.url,
      method: SummaryApi.getAllUsers.method,
    });

    dispatch(setAllUsers(res.data?.users || []));
  } catch (err) {
    dispatch(
      setAllUsersError(
        err.response?.data?.message || "Failed to load users"
      )
    );
  }
};


useEffect(() => {
  fetchAllUsers();
  // eslint-disable-next-line
}, []);

  // ======================
  // MODAL HANDLERS
  // ======================
  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // ======================
  // 🔥 UPDATE USER
  // ======================
  const updateUser = async () => {
    try {
    //   dispatch(setAllUsersLoading(true));

      await api({
        url: SummaryApi.updateUser.url(selectedUser._id),
        method: SummaryApi.updateUser.method,
        data: {
          role: selectedUser.role,
          designation: selectedUser.designation,
        },
      });

      const updatedUsers = users.map((u) =>
        u._id === selectedUser._id ? selectedUser : u
      );

      dispatch(setAllUsers(updatedUsers));
      closeModal();

      return { success: true };
    } catch (err) {
      dispatch(setAllUsersLoading(false));
      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to update user",
      };
    }
  };

  // ======================
  // 🔥 DELETE USER
  // ======================
  const deleteUser = async (userId) => {
    try {
    //   dispatch(setAllUsersLoading(true));

      await api({
        url: SummaryApi.deleteUser.url(userId),
        method: SummaryApi.deleteUser.method,
      });

      dispatch(
        setAllUsers(users.filter((u) => u._id !== userId))
      );

      return { success: true };
    } catch (err) {
      dispatch(setAllUsersLoading(false));
      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to delete user",
      };
    }
  };

  return {
    users,
    loading,

    // modal
    showModal,
    selectedUser,
    setSelectedUser,

    // actions
    openEditModal,
    closeModal,
    fetchAllUsers,
    updateUser,
    deleteUser,
  };
};

export default useAllUsers;
