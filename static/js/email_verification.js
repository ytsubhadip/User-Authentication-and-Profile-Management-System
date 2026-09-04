const VerificationForm = document.getElementById("verification-form");

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

  
    