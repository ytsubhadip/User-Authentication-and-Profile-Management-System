const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
const userInfo = localStorage.getItem("user_info");

if (!userInfo) {
    window.location.href = "/";
} else {
    let user;

    try {
        user = JSON.parse(userInfo);
    } catch (error) {
        localStorage.removeItem("user_info");
        window.location.href = "/";
    }

    if (user) {
        document.getElementById("userName").textContent = user.full_name || "Your Name";
        document.getElementById("userEmail").textContent = user.email || "Not available";
        document.getElementById("phoneNumber").textContent = user.phone_number || "Not available";
        document.getElementById("userDOB").textContent = user.date_of_birth || "Not available";
        document.getElementById("profilepreview").src = user.profile_image || defaultProfileImage;

        document.getElementById("logoutBtn").addEventListener("click", function () {
            localStorage.removeItem("user_info");
            localStorage.removeItem("verify_email");
            window.location.href = "/";
        });

        const profileUpload = document.getElementById("profileUpload");
        const profilePreview = document.getElementById("profilepreview");


        const editProfileButton = document.querySelector(".edit-profile-btn");
        const profileEdit = document.querySelector(".profile-edit");
        const ProfileEditForm = document.getElementById("ProfileEditForm");
        const editPasswordButton = document.querySelector(".edit-pssword-btn");
        const passwordEdit = document.querySelector(".password-edit");
        const passwordEditForm = document.getElementById("passwordEditForm");

        // Hide when page loads
        profileEdit.style.display = "none";
        passwordEdit.style.display = "none";

        // Show / Hide when button is clicked
        editProfileButton.addEventListener("click", async function (e) {

            if (profileEdit.style.display === "none") {
                profileEdit.style.display = "block";
            } else {
                profileEdit.style.display = "none";
            }

            document.getElementById("user_name").value = user.full_name || "";
            document.getElementById("user_phone").value = user.phone_number || "";
            document.getElementById("user_dob").value = user.date_of_birth || "";

        });

        editPasswordButton.addEventListener("click", function () {
            passwordEdit.style.display = passwordEdit.style.display === "none" ? "block" : "none";
            profileEdit.style.display = "none";
        });

        passwordEditForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const oldPassword = document.getElementById("old_password").value;
            const newPassword = document.getElementById("new_password").value;

            if (newPassword.length < 10) {
                alert("New password must be at least 10 characters long.");
                return;
            }

            try {
                const response = await fetch("/api/auth/change-password", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        old_password: oldPassword,
                        new_password: newPassword
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.detail || "Password change failed");
                }

                alert(data.message);
                passwordEditForm.reset();
                passwordEdit.style.display = "none";
            } catch (error) {
                console.error("Password change error:", error);
                alert(error.message || "Something went wrong!");
            }
        });



        profileUpload.addEventListener("change", async function () {
            const [file] = profileUpload.files;

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image.");
                profileUpload.value = "";
                return;
            }

            if (!user.user_id) {
                alert("User not found. Please login again.");
                window.location.href = "/";
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            profilePreview.src = previewUrl;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch(`/api/profile/upload/${user.user_id}`, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (!response.ok || !data.profile_image) {
                    throw new Error(data.detail || "Profile image upload failed");
                }

                user.profile_image = data.profile_image;
                localStorage.setItem("user_info", JSON.stringify(user));
                profilePreview.src = user.profile_image;
                alert("Profile picture updated successfully!");
            } catch (error) {
                profilePreview.src = user.profile_image || defaultProfileImage;
                console.error("Profile upload error:", error);
                alert(error.message || "Something went wrong!");
            } finally {
                URL.revokeObjectURL(previewUrl);
                profileUpload.value = "";
            }
        });

        ProfileEditForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const updatedData = {
                full_name: document.getElementById("user_name").value,
                phone_number: document.getElementById("user_phone").value,
                date_of_birth: document.getElementById("user_dob").value
            };

            try {
                const response = await fetch(`/api/profile/update/${user.user_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedData)
                });
                const data = await response.json();
                if (!response.ok || !data.message) {
                    throw new Error(data.detail || "Profile update failed");
                }
                alert("Profile updated successfully!");
                document.getElementById("userName").textContent = user.full_name = updatedData.full_name;
                document.getElementById("phoneNumber").textContent = user.phone_number = updatedData.phone_number;
                document.getElementById("userDOB").textContent = user.date_of_birth = updatedData.date_of_birth;
                localStorage.setItem("user_info", JSON.stringify(user));
                profileEdit.style.display = "none";
                

            } catch (error) {
                console.error("Profile update error:", error);
                alert(error.message || "Something went wrong!");
            }
        });
    }
}
