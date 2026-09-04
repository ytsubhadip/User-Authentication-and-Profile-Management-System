document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        // Email is not verified
        if (response.status === 403) {

            alert("Please verify your email first.");

            // Save email temporarily
            localStorage.setItem("verify_email", email);

            // Redirect to OTP verification page
            window.location.href = "/verify-page";
            return;
        }

        if (response.ok) {

            alert("Login successful!");

            // Optional: save user data
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("user_email", data.email);

            // Redirect to dashboard
            window.location.href = "/dashboard";

        } else {
            alert(data.detail || "Login failed");
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong!");
    }
});