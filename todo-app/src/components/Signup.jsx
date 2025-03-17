import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
      });
      navigate("/todolist");
    } catch (error) {
      console.error("Error signing up", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-btn" onClick={handleSignup}>
          Sign Up
        </button>
        <p className="login-link">
          Have an account already? <Link to="/" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;