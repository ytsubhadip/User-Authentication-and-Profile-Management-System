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
                const response = await fetch(`/api/upload/profile/${user.user_id}`, {
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
    }
}
