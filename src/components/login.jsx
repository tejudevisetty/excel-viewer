import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();

  const validations = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting, setFieldError }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email === values.email && u.password === values.password
    );
    if (!user) {
      setFieldError("password", "Invalid email or password");
      setSubmitting(false);
      return;
    }

    // saving user login info in local storage

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    navigate("/dashboard");

    setSubmitting(false);
  };


  return (
    <Container fluid className="signup-page">
      <Row className="w-100">

        {/* left part of page */}

        <Col md={6} className="left-section">
          <div className="form-container">
            <div className="person-icon  mb-2 fs-1 text-secondary" >           <i class="bi bi-person-circle"></i>
</div>
            <h1 className=" text-center  fs-3" >Login</h1>

            <Formik
          initialValues={{ email: "", password: "" }}
          validations={validations}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" >
              <div className="mb-3">
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  autoComplete="off"
                />
                <small className="text-danger">
                  <ErrorMessage name="email" />
                </small>
              </div>

              <div className="mb-3">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                />
                <small className="text-danger">
                  <ErrorMessage name="password" />
                </small>
              </div>
              <button
                type="submit"
                className="btn common-btn w-100 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center mt-3 mb-0">
                Don’t have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </Form>
          )}
        </Formik>
          </div>
        </Col>

        {/* right part of the page */}
        <Col md={6} className="right-section">
          <div>
            
            <h2 className=" fs-2 fw-bolder" >Welcome Back!</h2>
            <p className=" fs-5" >
              Log in to access your dashboard, manage spreadsheet data,
      and analyze information efficiently.
            </p>
            
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default Login;
