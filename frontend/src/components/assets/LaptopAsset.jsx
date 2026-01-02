import React, { useRef, useState } from "react";
import {
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LaptopAsset = () => {
    const [previewIndex, setPreviewIndex] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});


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

        //  DataTransfer magic
        const dataTransfer = new DataTransfer();
        updatedImages.forEach((img) => {
            dataTransfer.items.add(img.file);
        });

        // Update input files
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }
        setLaptop({ ...laptop, images: updatedImages });
    };


    /* SUBMIT */
    const handleSubmit = () => {
        const newErrors = {};

        if (!laptop.company.trim()) newErrors.company = "This field is required";
        if (!laptop.assetCode.trim()) newErrors.assetCode = "This field is required";
        if (!laptop.assignedTo.trim()) newErrors.assignedTo = "This field is required";
        if (!laptop.officialEmail.trim())
            newErrors.officialEmail = "This field is required";
        if (!laptop.employeeEmail.trim())
            newErrors.employeeEmail = "This field is required";
        if (!laptop.phoneNumber.trim())
            newErrors.phoneNumber = "This field is required";
        if (laptop.images.length === 0)
            newErrors.images = "At least one image is required";

        // Agar error hai to yahin stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill all required fields");
            return;
        }

        // Extra validation (optional but good)
        if (!/^[0-9]{10}$/.test(laptop.phoneNumber)) {
            setErrors({ phoneNumber: "Phone number must be 10 digits" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            !emailRegex.test(laptop.officialEmail) ||
            !emailRegex.test(laptop.employeeEmail)
        ) {
            setErrors({
                officialEmail: "Invalid email",
                employeeEmail: "Invalid email",
            });
            return;
        }

        // SUCCESS
        setErrors({});

        const existing =
            JSON.parse(localStorage.getItem("laptopAssets")) || [];

        localStorage.setItem(
            "laptopAssets",
            JSON.stringify([...existing, { ...laptop, id: Date.now() }])
        );

        toast.success("Created Successfully");

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
    };

    return (
        <>
            <style>{`
        .assets-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 6px 25px rgba(0,0,0,0.08);
        }

        .asset-inner {
          border: 1px solid #e1e1e1;
          border-radius: 12px;
          padding: 22px;
        }

        .asset-header {
          margin-bottom: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 20px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 6px;
          display: block;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 11px 12px;
          border-radius: 8px;
          border: 1px solid #cfd6dc;
          outline: none;
          font-size: 14px;
        }

        textarea {
          resize: none;
        }

        .save-btn {
          margin-top: 18px;
          background: #70a664;
          color: white;
          border: none;
          padding: 10px 26px;
          border-radius: 22px;
          font-weight: 600;
          cursor: pointer;
        }

        .empty-box {
          text-align: center;
          padding: 50px;
          color: #6c757d;
          font-weight: 600;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .page-header {
          background: #70a664a1;
          padding: 13px 30px;
          color: white;
          font-size: 25px;
          font-weight: 700;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .asset-select {
          padding: 8px 40px 8px 18px;
          border-radius: 25px;
          font-weight: 600;
          border: none;
        }

        .assets-card {
          background: #fff;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 6px 25px rgba(0,0,0,0.08);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 11px;
          border-radius: 8px;
          border: 1px solid #cfd6dc;
        }

        .image-row {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .img-box {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .img-box .delete {
           position: absolute;
    bottom: 6px;
    right: 3px;
    background: #ff0000;
    color: #fff;
    border-radius: 50%;
    padding: 1px 8px 5px 7px;
    display: none;
    height: 26px;
    width: 26px;
        }

        .img-box:hover .delete {
          display: block;
        }

        .save-btn {
          margin-top: 18px;
          background: #70a664;
          color: white;
          border: none;
          padding: 10px 26px;
          border-radius: 22px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
          .preview-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}

.preview-img {
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  display: block;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  padding: 10px 14px;
  border-radius: 50%;
  cursor: pointer;
}

.nav-btn.left {
  left: 12px;
}

.nav-btn.right {
  right: 12px;
}

.input-error {
  border: 1px solid red !important;
}

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

.required-star {
  color: red;
  margin-left: 4px;
  font-weight: 700;
}
      `}</style>

            <div className="asset-inner">
                <h5><u>Laptop Asset Details</u></h5>

                <div className="form-grid pt-3">
                    {/* EXISTING FIELDS */}
                    <div className="form-group">
                        <label>Company Name<span className="required-star">*</span></label>
                        <input
                            className={errors.company ? "input-error" : ""}
                            value={laptop.company}
                            onChange={(e) =>
                                setLaptop({ ...laptop, company: e.target.value })
                            }
                        />
                        {errors.company && (
                            <div className="error-text">{errors.company}</div>
                        )}
                    </div>


                    <div className="form-group">
                        <label>Model</label>
                        <input
                            value={laptop.model}
                            onChange={(e) =>
                                setLaptop({ ...laptop, model: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Serial Number</label>
                        <input
                            value={laptop.serialNo}
                            onChange={(e) =>
                                setLaptop({ ...laptop, serialNo: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Asset Code (Sticker)<span className="required-star">*</span></label>
                        <input
                            className={errors.assetCode ? "input-error" : ""}
                            value={laptop.assetCode}
                            onChange={(e) =>
                                setLaptop({ ...laptop, assetCode: e.target.value })
                            }
                        />
                        {errors.assetCode && (
                            <div className="error-text">{errors.assetCode}</div>
                        )}
                    </div>


                    <div className="form-group">
                        <label>Assigned To<span className="required-star">*</span></label>
                        <input
                            className={errors.assignedTo ? "input-error" : ""}
                            value={laptop.assignedTo}
                            onChange={(e) =>
                                setLaptop({ ...laptop, assignedTo: e.target.value })
                            }
                        />
                        {errors.assignedTo && (
                            <div className="error-text">{errors.assignedTo}</div>
                        )}
                    </div>


                    <div className="form-group">
                        <label>Official Email ID<span className="required-star">*</span></label>
                        <input
                            type="email"
                            className={errors.officialEmail ? "input-error" : ""}
                            value={laptop.officialEmail}
                            onChange={(e) =>
                                setLaptop({ ...laptop, officialEmail: e.target.value })
                            }
                        />
                        {errors.officialEmail && (
                            <div className="error-text">{errors.officialEmail}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Employee Personal Email ID<span className="required-star">*</span></label>
                        <input
                            type="email"
                            className={errors.employeeEmail ? "input-error" : ""}
                            value={laptop.employeeEmail}
                            onChange={(e) =>
                                setLaptop({ ...laptop, employeeEmail: e.target.value })
                            }
                        />
                        {errors.employeeEmail && (
                            <div className="error-text">{errors.employeeEmail}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Phone Number<span className="required-star">*</span></label>
                        <input
                            type="tel"
                            maxLength={10}
                            className={errors.phoneNumber ? "input-error" : ""}
                            value={laptop.phoneNumber}
                            onChange={(e) =>
                                setLaptop({ ...laptop, phoneNumber: e.target.value })
                            }
                        />
                        {errors.phoneNumber && (
                            <div className="error-text">{errors.phoneNumber}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Remarks</label>
                        <textarea
                            rows="3"
                            value={laptop.remarks}
                            onChange={(e) =>
                                setLaptop({ ...laptop, remarks: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Purchase</label>
                        <input
                            type="date"
                            value={laptop.purchaseDate}
                            onChange={(e) =>
                                setLaptop({ ...laptop, purchaseDate: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Asset Condition</label>
                        <select
                            value={laptop.assetCondition}
                            onChange={(e) =>
                                setLaptop({ ...laptop, assetCondition: e.target.value })
                            }
                        >
                            <option value="">Select</option>
                            <option value="New">New</option>
                            <option value="Refurbished">Refurbished</option>
                            <option value="Rented">Rented</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Purchased From</label>
                        <input
                            value={laptop.purchasedFrom}
                            onChange={(e) =>
                                setLaptop({ ...laptop, purchasedFrom: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Warranty (Months)</label>
                        <input
                            type="number"
                            value={laptop.warranty}
                            onChange={(e) =>
                                setLaptop({ ...laptop, warranty: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Antivirus Start Date</label>
                        <input
                            type="date"
                            value={laptop.antivirusStart}
                            onChange={(e) =>
                                setLaptop({ ...laptop, antivirusStart: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Antivirus End Date</label>
                        <input
                            type="date"
                            value={laptop.antivirusEnd}
                            onChange={(e) =>
                                setLaptop({ ...laptop, antivirusEnd: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>RAM (GB)</label>
                        <input
                            value={laptop.ram}
                            onChange={(e) =>
                                setLaptop({ ...laptop, ram: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Storage</label>
                        <input
                            value={laptop.storage}
                            onChange={(e) =>
                                setLaptop({ ...laptop, storage: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Processor</label>
                        <input
                            value={laptop.processor}
                            onChange={(e) =>
                                setLaptop({ ...laptop, processor: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Laptop Images
                            <span className="required-star">*</span>
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />

                        <div
                            className={`image-row ${errors.images ? "image-error" : ""
                                }`}
                        >
                            {laptop.images.map((img, index) => (
                                <div
                                    key={index}
                                    className="img-box"
                                    onClick={() => setPreviewIndex(index)}
                                >
                                    <img src={img.url} alt="" />
                                    <div
                                        className="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                    >
                                        <FaTrash size={12} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 🔴 ERROR TEXT */}
                        {errors.images && (
                            <div className="error-text">{errors.images}</div>
                        )}
                    </div>

                </div>

                <button className="save-btn" onClick={handleSubmit}>
                    Submit
                </button>
            </div>

            {/* IMAGE MODAL */}
            <Modal show={previewIndex !== null} onHide={() => setPreviewIndex(null)} centered>
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
