import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LaptopAssetForm from "./LaptopAssetForm";
import axios from "../../api/axiosInstance";
import SummaryApi from "../../common";
import { useDispatch } from "react-redux";
import { addLaptopAsset } from "../../store/laptopAssetSlice";
import AssignedToSelector from "../../components/assets/AssignedToSelector";


const LaptopAsset = () => {
    const dispatch = useDispatch();

    const [previewIndex, setPreviewIndex] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [laptop, setLaptop] = useState({
        company: "",
        model: "",
        serialNo: "",
        assetCode: "",
        assignedTo: "",
        officialEmail: "",
        employeeEmail: "",
        phoneNumber: "",
        remarks: "",
        purchaseDate: "",
        assetCondition: "",
        purchasedFrom: "",
        warranty: "",
        antivirusStart: "",
        antivirusEnd: "",
        ram: "",
        storage: "",
        processor: "",
        images: [],
    });

    /* IMAGE UPLOAD */
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const images = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setLaptop((prev) => ({
            ...prev,
            images: [...prev.images, ...images],
        }));
    };

    const removeImage = (index) => {
        const updatedImages = laptop.images.filter((_, i) => i !== index);

        const dataTransfer = new DataTransfer();
        updatedImages.forEach((img) =>
            dataTransfer.items.add(img.file)
        );

        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }

        setLaptop({ ...laptop, images: updatedImages });
    };

    const handleAssignedSelect = (user) => {
        setLaptop((prev) => ({
            ...prev,
            assignedTo: user._id,        // ✅ ObjectId
            assignedToName: user.name,   // 👁️ UI only
        }));
    };


    /* =========================
       SUBMIT (API CALL HERE)
    ========================= */
    const handleSubmit = async () => {
        const newErrors = {};

        if (!laptop.company.trim()) newErrors.company = "Required";
        if (!laptop.assetCode.trim()) newErrors.assetCode = "Required";
        if (!laptop.assignedTo.trim()) newErrors.assignedTo = "Required";
        if (!laptop.officialEmail.trim()) newErrors.officialEmail = "Required";
        if (!laptop.employeeEmail.trim()) newErrors.employeeEmail = "Required";
        if (!laptop.phoneNumber.trim()) newErrors.phoneNumber = "Required";
        if (laptop.images.length === 0)
            newErrors.images = "At least one image required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill all required fields");
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            // ----------------------
            // FORM DATA
            // ----------------------
            const formData = new FormData();

            Object.entries(laptop).forEach(([key, value]) => {
                if (key !== "images") {
                    formData.append(key, value);
                }
            });

            laptop.images.forEach((img) => {
                formData.append("images", img.file);
            });

            // ----------------------
            // API CALL
            // ----------------------
            const res = await axios({
                url: SummaryApi.createLaptopAsset.url,
                method: SummaryApi.createLaptopAsset.method,
                data: formData,
            });

            // ----------------------
            // UPDATE REDUX LIST
            // ----------------------
            dispatch(addLaptopAsset(res.data.data));

            toast.success("Laptop asset created successfully");

            // ----------------------
            // RESET FORM
            // ----------------------
            setLaptop({
                company: "",
                model: "",
                serialNo: "",
                assetCode: "",
                assignedTo: "",
                officialEmail: "",
                employeeEmail: "",
                phoneNumber: "",
                remarks: "",
                purchaseDate: "",
                assetCondition: "",
                purchasedFrom: "",
                warranty: "",
                antivirusStart: "",
                antivirusEnd: "",
                ram: "",
                storage: "",
                processor: "",
                images: [],
            });

            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create laptop asset"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <LaptopAssetForm
                laptop={laptop}
                setLaptop={setLaptop}
                errors={errors}
                fileInputRef={fileInputRef}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onPreview={setPreviewIndex}
                onSubmit={handleSubmit}
                submitting={submitting}
                onOpenAssignModal={() => setShowAssignModal(true)}
            />

            <AssignedToSelector
                show={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onSelect={handleAssignedSelect}
            />

            {/* IMAGE PREVIEW MODAL */}
            <Modal
                show={previewIndex !== null}
                onHide={() => setPreviewIndex(null)}
                centered
            >
                <Modal.Body className="p-0">
                    {previewIndex !== null && (
                        <div className="preview-wrapper">
                            <img
                                src={laptop.images[previewIndex]?.url}
                                alt=""
                                className="preview-img"
                            />

                            <button
                                className="nav-btn left"
                                onClick={() =>
                                    setPreviewIndex(
                                        previewIndex > 0
                                            ? previewIndex - 1
                                            : laptop.images.length - 1
                                    )
                                }
                            >
                                <FaChevronLeft />
                            </button>

                            <button
                                className="nav-btn right"
                                onClick={() =>
                                    setPreviewIndex(
                                        previewIndex < laptop.images.length - 1
                                            ? previewIndex + 1
                                            : 0
                                    )
                                }
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </>
    );
};

export default LaptopAsset;
