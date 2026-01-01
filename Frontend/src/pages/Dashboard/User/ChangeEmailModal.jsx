// import React, { useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";

// const ChangeEmailModal = ({ onClose, onPendingEmail }) => {
//   const [step, setStep] = useState("email"); // email | sending | otp
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ===== SEND OTP ===== */
//   const sendOtp = async () => {
//     if (!email) return toast.error("Enter email");

//     try {
//       setLoading(true);
//       setStep("sending");

//       await api.put("/auth/setPendingEmail", { email });

//       onPendingEmail(email); // tell parent immediately
//       toast.success("OTP sent to email");

//       setStep("otp");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//       setStep("email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===== VERIFY OTP ===== */
//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     try {
//       setLoading(true);

//       await api.post("/auth/verify-email-otp", { otp });

//       toast.success("Email verified");
//       onClose(true); // verified
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">

//         {/* STEP: ENTER EMAIL */}
//         {step === "email" && (
//           <>
//             <h2 className="text-lg font-bold">Change Email</h2>

//             <input
//               type="email"
//               placeholder="Enter new email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2"
//             />

//             <div className="flex justify-end gap-3">
//               <button onClick={() => onClose(false)} className="px-4 py-2 border rounded-lg">
//                 Cancel
//               </button>
//               <button onClick={sendOtp} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
//                 Next
//               </button>
//             </div>
//           </>
//         )}

//         {/* STEP: SENDING OTP */}
//         {step === "sending" && (
//           <div className="text-center space-y-3">
//             <p className="font-medium">Sending OTP...</p>
//             <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
//           </div>
//         )}

//         {/* STEP: VERIFY OTP */}
//         {step === "otp" && (
//           <>
//             <h2 className="text-lg font-bold">Verify OTP</h2>

//             <input
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2"
//             />

//             <div className="flex justify-end gap-3">
//               <button onClick={() => onClose(false)} className="px-4 py-2 border rounded-lg">
//                 Cancel
//               </button>
//               <button
//                 onClick={verifyOtp}
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Verify
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeEmailModal;

// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";

// const ChangeEmailModal = ({
//   mode = "email",          // "email" | "otp"
//   defaultEmail = "",
//   onPendingEmail,
//   onClose,
// }) => {
//   const [step, setStep] = useState(mode === "otp" ? "otp" : "email");
//   const [email, setEmail] = useState(defaultEmail);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= RESEND OTP ================= */
//   const sendOtp = async (emailToSend) => {
//     try {
//       setLoading(true);
//       toast.loading("Sending OTP...");

//       await api.put("/auth/setPendingEmail", {
//         email: emailToSend,
//       });

//       toast.dismiss();
//       toast.success("OTP sent to email");
//       setStep("otp");
//     } catch (err) {
//       toast.dismiss();
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//       onClose(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= AUTO SEND OTP (UNVERIFIED CLICK) ================= */
//   useEffect(() => {
//     if (mode === "otp" && defaultEmail) {
//       sendOtp(defaultEmail);
//     }
//   }, []);

//   /* ================= VERIFY OTP ================= */
//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     try {
//       setLoading(true);

//       await api.post("/auth/verify-email-otp", { otp });

//       toast.success("Email verified successfully");
//       onClose(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

//         {/* ================= ENTER EMAIL ================= */}
//         {step === "email" && (
//           <>
//             <h3 className="text-lg font-semibold mb-4">Change Email</h3>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter new email"
//               className="w-full border rounded-lg px-4 py-2 mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={loading}
//                 onClick={() => {
//                   if (!email) return toast.error("Enter email");
//                   onPendingEmail(email);
//                   sendOtp(email);
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}

//         {/* ================= OTP ================= */}
//         {step === "otp" && (
//           <>
//             <h3 className="text-lg font-semibold mb-2">Verify Email</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Enter the OTP sent to <b>{email}</b>
//             </p>

//             <input
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full border rounded-lg px-4 py-2 mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={loading}
//                 onClick={verifyOtp}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Verify
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeEmailModal;

import { useEffect, useState } from "react";
import api from "../../../axios/axios";
import { toast } from "sonner";

const ChangeEmailModal = ({
  mode,
  defaultEmail,
  onPendingEmail,
  onClose,
}) => {
  const [step, setStep] = useState(
    mode === "verify" ? "otp" : "email"
  );

  const [email, setEmail] = useState(defaultEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  const sendOtp = async (emailToSend) => {
    try {
      setLoading(true);
      toast.loading("Sending OTP...");

      await api.put("/auth/setPendingEmail", {
        email: emailToSend,
      });

      toast.dismiss();
      toast.success("OTP sent");
      setStep("otp");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to send OTP");
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO RESEND (UNVERIFIED) ================= */
  useEffect(() => {
    if (mode === "verify" && defaultEmail) {
      sendOtp(defaultEmail);
    }
  }, []);

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      await api.post("/auth/verify-email-otp", { otp });
      toast.success("Email verified");
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

        {/* ================= ENTER EMAIL ================= */}
        {step === "email" && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Change Email
            </h3>

            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              className="w-full border rounded-lg px-4 py-2 mb-4 disabled:bg-gray-100"
            />

            <div className="flex justify-end gap-3">
              <button
                disabled={loading}
                onClick={() => onClose(false)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={() => {
                  if (!email) return toast.error("Enter email");
                  onPendingEmail(email);
                  sendOtp(email);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Next"}
              </button>
            </div>
          </>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <>
            <h3 className="text-lg font-semibold mb-2">
              Verify Email
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter OTP sent to <b>{email}</b>
            </p>

            <input
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border rounded-lg px-4 py-2 mb-4 disabled:bg-gray-100"
            />

            <div className="flex justify-end gap-3">
              <button
                disabled={loading}
                onClick={() => onClose(false)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={verifyOtp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailModal;


