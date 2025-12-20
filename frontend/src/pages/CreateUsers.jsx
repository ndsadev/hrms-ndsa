import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// API
import api from "../api/axiosInstance";
import SummaryApi from "../common";

// TOAST
import { toast } from "react-toastify";

const CreateUsers = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    designation: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // BUTTON LOADING STATE
  const [loading, setLoading] = useState(false);

  const validate = (values = form) => {
    const errs = {};

    if (!values.name.trim()) errs.name = "Name is required.";

    if (!values.email.trim()) errs.email = "Email is required.";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    )
      errs.email = "Enter a valid email.";

    if (!values.employeeId.trim())
      errs.employeeId = "Employee ID is required.";

    if (!values.designation.trim())
      errs.designation = "Designation is required.";

    if (!values.phone.trim()) errs.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(values.phone))
      errs.phone = "Enter exactly 10 digits.";

    if (!values.password) errs.password = "Password is required.";
    else if (values.password.length < 8)
      errs.password = "Minimum 8 characters required.";

    if (!values.confirmPassword)
      errs.confirmPassword = "Confirm password.";
    else if (values.confirmPassword !== values.password)
      errs.confirmPassword = "Passwords do not match.";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // CREATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length !== 0) return;

    try {
      setLoading(true);

      await api({
        url: SummaryApi.createUser.url,
        method: SummaryApi.createUser.method,
        data: {
          name: form.name,
          email: form.email,
          employeeId: form.employeeId,
          designation: form.designation,
          phone: form.phone,
          password: form.password,
        },
      });

      toast.success("User created successfully");

      setForm({
        name: "",
        email: "",
        employeeId: "",
        designation: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .page-header {
          background: #70a664a1;
          padding: 13px 30px;
          color: white;
          font-size: 25px;
          font-weight: 700;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #70a66433;
        }

        .form-card {
          border-radius: 9px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
          padding: 50px;
          background: white;
        }

        .form-label, .title {
          font-size: 17px;
          font-weight: 600;
        }

        /* REMOVE BLUE FOCUS BORDER (BOOTSTRAP + BROWSER) */
.form-control:focus,
.form-control:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border-color: #cfd4da !important; /* soft grey */
  background-color: #f9fafb !important;
}

/* INPUT GROUP BUTTON (EYE ICON) FOCUS FIX */
.input-group .btn:focus,
.input-group .btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* INPUT GROUP TEXT (ICON) */
.input-group-text {
  box-shadow: none !important;
  background-color: #e0e3e7;
}

/* INVALID STATE — RED ONLY WHEN ERROR */
.form-control.is-invalid:focus {
  box-shadow: none !important;
  border-color: #dc3545 !important;
}

/* OPTIONAL: HOVER FEEL (PROFESSIONAL TOUCH) */
.form-control:hover {
  border-color: #bfc5cb !important;
}

      `}</style>

      <Container>
        <Row>
          <div className="page-header">Create User</div>
        </Row>

        <Row>
          <Card className="form-card">
            <Form onSubmit={handleSubmit}>
              <Row className="gy-4">
                     {/* FULL NAME */}
                <Col md={6}>
                  <Form.Label className="title">Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Shubhanshu Tiwari"
                      className={form.name ? "filled" : ""}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* EMAIL */}
                <Col md={6}>
                  <Form.Label className="title">Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={form.email ? "filled" : ""}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* EMPLOYEE ID */}
                <Col md={6}>
                  <Form.Label className="title">Employee ID</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaIdBadge />
                    </InputGroup.Text>

                    <Form.Control
                      name="employeeId"
                      value={form.employeeId}
                      placeholder="NDSA000"
                      className={form.employeeId ? "filled" : ""}
                      isInvalid={!!errors.employeeId}
                      onFocus={() => {
                        if (!form.employeeId) {
                          setForm((s) => ({ ...s, employeeId: "NDSA" }));
                        }
                      }}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (!value.startsWith("NDSA")) {
                          value = "NDSA";
                        }

                        setForm((s) => ({ ...s, employeeId: value }));
                      }}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.employeeId}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* DESIGNATION */}
                <Col md={6}>
                  <Form.Label className="title">Designation</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaIdBadge /></InputGroup.Text>
                    <Form.Control
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="e.g. Product Manager"
                      className={form.designation ? "filled" : ""}
                      isInvalid={!!errors.designation}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.designation}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* PHONE */}
                <Col md={6}>
                  <Form.Label className="title">Phone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>+91</InputGroup.Text>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10 digit number"
                      className={form.phone ? "filled" : ""}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <small>Exactly 10 digits required</small>
                </Col>

                {/* PASSWORD */}
                <Col md={6}>
                  <Form.Label className="title">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaLock /></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={form.password ? "filled" : ""}
                      isInvalid={!!errors.password}
                    />
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* CONFIRM PASSWORD */}
                <Col md={6}>
                  <Form.Label className="title">Confirm Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaLock /></InputGroup.Text>
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className={form.confirmPassword ? "filled" : ""}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                {/* SUBMIT */}
                <Col xs={12} className="text-end mt-5">
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#06406e",
                      padding: "12px 36px",
                      border: "none",
                      fontSize: "17px",
                      minWidth: "160px",
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </Col>

              </Row>
            </Form>
          </Card>
        </Row>
      </Container>
    </>
  );
};

export default CreateUsers;
