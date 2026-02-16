import React, { useEffect, useState } from 'react';
import { Search, Mail, CheckCircle } from 'lucide-react';

export default function AdminProfile() {

    const [userName, setUserName] = useState("Loading...");
        const [roleName, setRoleName] = useState("");
    const [phone, setPhone] = useState("");
    const [admin, setAdmin] = useState("");
    const [company, setCompany] = useState([]);
    const [showOTPSection, setShowOTPSection] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const role=localStorage.getItem("role");
    const user=localStorage.getItem("user");

    const userId=localStorage.getItem("userId");

    // console.log(role);
    // console.log(userId);
    const fetchcompany=async()=>{
        try{
            const res=await fetch(`http://localhost:4000/getCompanyByAdminId/${userId}`);
            // const res = await fetch(url);
            const data = await res.json();
            // console.log(data);
            setCompany(data.assignedCompanies);
        }
        catch(err){
            console.log(err);
        }

    }

    // Handle sending OTP
    const handleSendOTP = async () => {
        if (!email) {
            setMessage("Please enter your email address");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, userId })
            });
            const data = await res.json();
            
            if (res.ok) {
                setOtpSent(true);
                setMessage("OTP sent to your email");
            } else {
                setMessage(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setMessage("Error sending OTP: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle verifying OTP
    const handleVerifyOTP = async () => {
        if (!otp) {
            setMessage("Please enter OTP");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, userId })
            });
            const data = await res.json();
            
            if (res.ok) {
                setOtpVerified(true);
                setMessage("OTP verified successfully");
            } else {
                setMessage(data.message || "Invalid OTP");
            }
        } catch (err) {
            setMessage("Error verifying OTP: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle resetting password
    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setMessage("Please fill all password fields");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword, userId })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage("Password reset successfully!");
                // Reset form
                setTimeout(() => {
                    setShowOTPSection(false);
                    setEmail("");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setOtpSent(false);
                    setOtpVerified(false);
                    setMessage("");
                }, 2000);
            } else {
                setMessage(data.message || "Failed to reset password");
            }
        } catch (err) {
            setMessage("Error resetting password: " + err.message);
        } finally {
            setLoading(false);
        }
    };




    const fetchUser = async () => {
        try {
            if (!userId || !role) return;

            const r = role.toLowerCase();
            let url = "";

            // if (r === "superadmin") url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
            // else if (r === "employee") url = `http://localhost:4000/employee/getEmployee/${id}`;
             if (r === "admin") url = `http://localhost:4000/getAdmin/${userId}`;
             

            const res = await fetch(url);
            const data = await res.json();
            // console.log(data.admin);
            setAdmin(data.admin);
             if (r === "admin" && data.admin) {
                setUserName(data.admin.fullName);
                setRoleName("Admin");
                setPhone(data.admin.phone);
            }
        } catch {
            setUserName("User");
            setRoleName(role);
        }
    };
    const data=fetchUser();

    useEffect(() => {
            fetchUser();
        }, [userId, role]);
        useEffect(() => {
            fetchcompany();
        }, [userId]);


    console.log(admin);
    console.log(company);
    
  return (
    <div className="min-h-screen bg-gray-50 p-8 relative overflow-hidden">
      {/* Decorative gradient blobs - exact positions */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 translate-x-32"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-3xl opacity-40 translate-x-20 translate-y-20"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 -translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - My Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 h-fit">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" 
                alt="Profile" 
                className="w-56 h-56 object-cover grayscale rounded-full"
              />
            </div>
            
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-8">
              <h2 className="text-gray-800 font-semibold text-lg">My profile</h2>
              {/* <div className="text-right">
                <p className="text-gray-400 text-xs leading-tight">User Login ID Aug 2018 +8.14</p>
                <p className="text-gray-400 text-xs leading-tight">Windows 10 pro, New York (US)</p>
              </div> */}
            </div>
            
            {/* Profile Details */}
            <div className="space-y-6 mb-8">
              <p className="text-gray-800 text-base">{admin.fullName}</p>
              <p className="text-gray-600 text-base">{admin.phone}</p>
              <p className="text-gray-600 text-base">{admin.email}</p>
              {/* <p className="text-gray-600 text-base">{admin.company}</p> */}
            </div>
            
            {/* SMS Alerts */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-700 text-base font-bold">Active</span>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            
            {/* Save Button */}
            {/* <button className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 text-white py-3.5 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition">
              Save
            </button> */}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* My xPay accounts Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-800 font-semibold text-lg">Professional data</h2>
                <div className="flex items-center gap-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <button className="text-gray-400 text-sm">Edit</button>
                </div>
              </div>
              
              {/* Active Account */}
              <div className="mb-6">
                <p className="text-gray-800 font-medium text-base mb-3">Assigned Companies:</p>
                <div className="space-y-2">
                  {company.length > 0 ? (
                    company.map((comp, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <p className="text-gray-600 text-sm">{comp.companyName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No companies assigned</p>
                  )}
                </div>
              </div>
              
              
            </div>

            {/* Forgot Password Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-800 font-semibold text-lg">Forgot Password</h2>
                <Mail className="w-5 h-5 text-gray-400" />
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}

              {!otpSent ? (
                // Step 1: Enter Email
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Send OTP to Email"}
                  </button>
                </div>
              ) : !otpVerified ? (
                // Step 2: Verify OTP
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl tracking-widest"
                    />
                  </div>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : (
                // Step 3: Reset Password
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">Email verified successfully</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </div>
              )}

              {/* Cancel Button */}
              {(otpSent || otpVerified) && (
                <button
                  onClick={() => {
                    setShowOTPSection(false);
                    setEmail("");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setOtpSent(false);
                    setOtpVerified(false);
                    setMessage("");
                  }}
                  className="w-full mt-4 text-gray-600 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              )}
            </div>
            {/* <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-800 font-semibold text-lg">My bills</h2>
                <button className="text-gray-500 text-sm bg-gray-100 px-5 py-2 rounded-full">
                  Filter by
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600 text-base">Phone bill</span>
                  </div>
                  <button className="bg-green-400 text-white px-7 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition">
                    Bill paid
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-600 text-base">Internet bill</span>
                  </div>
                  <button className="bg-pink-400 text-white px-7 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition">
                    Bill paid
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600 text-base">House rent</span>
                  </div>
                  <button className="bg-green-400 text-white px-7 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition">
                    Bill paid
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600 text-base">Income tax</span>
                  </div>
                  <button className="bg-green-400 text-white px-7 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition">
                    Bill paid
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}