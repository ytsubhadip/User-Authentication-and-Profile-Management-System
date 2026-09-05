const OTPSendBtn = document.getElementById("OTPSendBtn");
const VerifyEmailButton = document.getElementById("VerifyEmailButton");

OTPSendBtn.addEventListener("click", async (e)=>{

    const email = document.getElementById("user-email").value;
    if(!email){
        alert("Please enter your email")
        return;
    }

   try{
        OTPSendBtn.disabled = true;
        OTPSendBtn.textContent = "Sending....";

         const response = await fetch("/api/auth/forgot-password-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

        const data = await response.json();
        
        if (!response.ok){
            throw new Error(data.detail || "Unable to resen otp");
        }
        alert(data.message || "A new OTP hasb been sent")
    }
    catch(error){
         console.error(error);
         alert(error.message);
    }
    finally {
            OTPSendBtn.textContent = "Resend OTP";
        }
    
})

VerifyEmailButton.addEventListener("click", async (e)=>{

    const email = document.getElementById("user-email").value;
    const otp = document.getElementById("user-otp").value;
    const newpassword = document.getElementById("user-newpassword").value;

    if(!email || !otp || !newpassword){
        alert("Please fill all the fields");
        return;
    }

    try{
        const response = await fetch("/api/auth/forgot-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp, newpassword })
        });

        const data = await response.json();

        if (!response.ok){
            throw new Error(data.detail || "Unable to update password");
        }

        alert(data.message || "Password updated successfully");
        window.location.href = "/";
    }
    catch(error){
        console.error(error);
        alert(error.message);
    }
})