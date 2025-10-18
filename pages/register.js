import { useContext, useState } from "react";
import { Key, Mail, RotateCcwKey, User } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { Button } from "../components/buttons/Button";
import Layout from "../components/layouts/Layout";
import { AlertContext, useAlert } from "../context/alertContext";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import CreateNewRepoModal from "../components/modals/CreateNewRepoModal";

export default function Register() {
  const router = useRouter();
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (firstName === "") {
      setFirstNameError("Missing first name");
      setLoading(false);
      return;
    } else {
      setFirstNameError("");
    }

    if (lastName === "") {
      setLastNameError("Missing last name");
      setLoading(false);
      return;
    } else {
      setLastNameError("");
    }

    if (email === "") {
      setEmailError("Missing email");
      setLoading(false);
      return;
    } else {
      setEmailError("");
    }

    if (password === "") {
      setPasswordError("Missing password");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    try {
      // Build request body
      const body = {
        full_name: `${firstName} ${lastName}`,
        email,
        password,
      };

      // Send POST request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        showAlert(data.message || "Registration failed", "error");
        setLoading(false);
        return;
      }

      // Registration successful
      showAlert("Account created successfully!", "success");
      // router.push("/login"); // redirect to login
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
      showAlert("Failed to register. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <AnimatePresence>
        {showCreateOrgModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCreateOrgModal(false)}
            />
            <CreateOrgModal
              setOrganizationId={setOrganizationId}
              setRoleId={setRoleId}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Layout>
        <div className="w-full h-[85vh] lg:h-[85vh] flex flex-col items-center justify-center fade-in-down">
          <div className="w-full text-center">
            <h1 className="dm-sans-medium text-xl text-black dark:text-white">
              Sign up
            </h1>
            <p className="dm-sans-light text-sm text-center text-stone-400 dark:text-stone-600 mt-1">
              Create your account and company to get started.
            </p>
          </div>

          <form
            onSubmit={handleRegistration}
            className="w-11/12 md:w-1/2 lg:w-1/3 flex flex-col gap-4 lg:gap-6 mt-6 lg:mt-8"
          >
            <div className="flex flex-row gap-2">
              <TextInput
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChange={setFirstName}
                icon={User}
                error={firstNameError}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={setLastName}
                icon={User}
                error={lastNameError}
              />
            </div>
            <TextInput
              label="Email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              icon={Mail}
              error={emailError}
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              icon={Key}
              error={passwordError}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              icon={RotateCcwKey}
            />

            <Button size="xl" type="submit" variant="solid" loading={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <button
            onClick={() => router.push("/login")}
            className="text-xs text-black/50 dark:text-stone-500 dm-sans-regular text-center mt-14 w-full"
          >
            Already have an account?{" "}
            <span className="text-black dark:text-stone-300 dm-sans-regular">
              Log In
            </span>
          </button>
        </div>
      </Layout>
    </>
  );
}
