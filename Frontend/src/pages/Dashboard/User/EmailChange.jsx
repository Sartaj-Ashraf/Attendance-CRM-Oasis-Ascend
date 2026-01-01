import { useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

const ChangeEmail =  ({ onClose, onEmailPending, existingPendingEmail }) => {
  const [step, setStep] = useState(existingPendingEmail ? 2 : 1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== SEND OTP ===== */
  const sendOtp = async () => {
    if (!email) return toast.error("Enter email");

    try {
      setLoading(true);
      await api.put("/auth/setPendingEmail", { email });

      toast.success("OTP sent to new email");
      onEmailPending(email); // update profile UI
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== VERIFY OTP (mock for now) ===== */
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    // 🔴 Replace with real API when ready
    toast.success("Email verified");
    onClose(true); // verified
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">
          {step === 1 ? "Change Email" : "Verify Email"}
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Verify
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeEmail;
