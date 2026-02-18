import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Signup = () => {
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting, setFieldError }) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = existingUsers.find(
      (user) => user.email === values.email
    );

    if (emailExists) {
      setFieldError("email", "Email already registered");
      setSubmitting(false);
      return;
    }

    const updatedUsers = [...existingUsers, values];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    navigate("/login");
    setSubmitting(false);
  };

  return (
    <Container fluid className="signup-page">
      <Row className="w-100">

        {/* Left section */}
        <Col md={6} className="left-section">
          <div className="form-container">
            <div className="person-icon mb-2 fs-1 text-secondary">
              <i className="bi bi-person-circle"></i>
            </div>
            <h1 className="text-center fs-3">Create Account</h1>

            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={validationSchema}  
              onSubmit={handleSubmit}
              validateOnChange={true}  
              validateOnBlur={true}    
            >
              {({ isSubmitting }) => (
                <Form autoComplete="off">
                  <div className="mb-3">
                    <Field
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your name"
                      autoComplete="off"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

          <div className="mb-3">
            <Field
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              autoComplete="off"
            />
                    <ErrorMessage
                      name="email"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="mb-3">
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                autoComplete="off"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger small"
              />
            </div>

                  <button
                    type="submit"
                    className="btn common-btn w-100 mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                  </button>

                  <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </span>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </Col>

        {/* Right section */}
        <Col md={6} className="right-section">
          <div>
            <h2 className="fs-2 fw-bolder">New Here?</h2>
            <p className="fs-5">
              Sign up to upload spreadsheets & view structured data
            </p>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default Signup;
