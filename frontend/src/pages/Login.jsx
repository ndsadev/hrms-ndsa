import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Image,
} from "react-bootstrap";

import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import logo from "../assets/logo.png";

const Login = () => {
  const { login, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
  });

  // SHOW LOGOUT SUCCESS TOAST HERE
  useEffect(() => {
    if (location.state?.fromLogout) {
      toast.success("Logged out successfully");

      // clear state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(form);

    if (result?.success) {
      toast.success("Login successful");

      const role = result.user?.role;

      // ROLE BASED REDIRECT
      if (role === "SUPER_ADMIN") {
        navigate("/dashboard/all-users", { replace: true });
      } else if (role === "HR") {
        navigate("/dashboard/employee-list", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/dashboard/assets", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } else {
      toast.error(result?.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #f5f6fa;
        }
        .logo-width {
          width: 100%;
        }
        .login-card {
          background: #fff;
          padding: 50px;
          border-radius: 40px;
          border: 1px solid #e9ecef;
          box-shadow: 0 6px 24px rgba(10,10,10,0.08);
        }
        .login-title {
          font-weight: 700;
        }
        .btn-custom {
          background-color: #06406e !important;
          color: #fff !important;
          padding: 10px 40px;
          border-radius: 30px;
          font-weight: 600;
          border: none;
        }
      `}</style>

      <div className="login-wrapper" style={{ backgroundColor: "#70a66433" }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={5}>
              <div className="login-card">
                <div className="text-center mb-3">
                  <Image src={logo} className="logo-width" />
                </div>

                <h4 className="text-center login-title">
                  <span style={{ color: "#06406e" }}>W</span>elcome Back{" "}
                  <span style={{ color: "#70a664" }}>!</span>
                </h4>

                <p className="text-center">
                  Sign in to optimize HR and Empower Employees.
                </p>

                <Form className="pt-4" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      placeholder="eg - NDSA100"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        style={{ background: "lightgrey", border: "none" }}
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {error && (
                    <p className="text-danger text-center">{error}</p>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <Button type="submit" className="btn-custom">
                      Login
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
