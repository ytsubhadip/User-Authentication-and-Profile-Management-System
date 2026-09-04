
// Check if user is already logged in
const existingUser = localStorage.getItem("user_info");

if (existingUser) {
    window.location.href = "/dashboard";
}


// login form
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

            if (!data.user) {
                throw new Error("Login response did not include user details");
            }

            const user = {
                user_id: data.user_id,
                email: data.user.email,
                full_name: data.user.full_name,
                phone_number: data.user.phone_number,
                date_of_birth: data.user.date_of_birth,
                profile_image: data.user.profile_image
            };

            localStorage.setItem("user_info", JSON.stringify(user));

            console.log("Saved user:", JSON.parse(localStorage.getItem("user_info")));

            alert("Login successful!");

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
