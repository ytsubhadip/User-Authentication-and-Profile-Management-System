const VerificationForm = document.getElementById("verification-form");
const ResendOTPButton = document.getElementById("resend-otp");

ResendOTPButton.addEventListener("click", async function(e){
    const email = localStorage.getItem("email");

    if(!email){
        alert("Email address not found");
        return;
    }

    try{
        ResendOTPButton.disabled = true;
        ResendOTPButton.textContent = "Sending....";

         const response = await fetch("/api/auth/resend-otp", {
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
            ResendOTPButton.disabled = false;
            ResendOTPButton.textContent = "Resend OTP";
        }
})

VerificationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const otp = document.getElementById("otp-input").value.trim();

    const email = localStorage.getItem("email");
    const payload = {'email': email, 'otp': otp };
    console.log(payload)
    try {
        
        const response = await fetch("/api/auth/verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Unable to verify email");
        }

        localStorage.removeItem("email");
        alert(data.message);
        window.location.href = "/";
    } catch (error) {
        alert(error.message);
    }
});



    