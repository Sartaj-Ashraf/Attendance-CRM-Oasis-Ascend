import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SetPassword from "./setPassword";
import api from "../axios/axios.js";
const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [user, setuser] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/verifyToken`, {
        params: {
          email,
          token,
        },
      })
      .then((res) => {
        setTimeout(() => {
          setuser(res.data);
          setLoading(false);
          setVerifying(true);
          console.log("helo");
        }, 1500);
      })
      .catch((err) => {
        console.log("error in catch ");
        setTimeout(() => {
          setLoading(false);
          setVerifying(false);
          setError(err.response?.data?.message || "Verification failed");
        }, 1500);
      });
  }, [email, token]);

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
      {loading && (
        <h2 className="text-3xl text-white">Verifying the user...</h2>
      )}

      {!loading && error && <h2 className="text-red-500 text-xl">{error}</h2>}

      {!loading && verifying && <SetPassword data={user} />}
    </div>
  );
};

export default Verify;
