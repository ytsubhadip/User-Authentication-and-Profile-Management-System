console.log("check")

const RegistrationForm = document.getElementById("user-registration");

function ValidatePassword(password){
    if (password.length < 10){
        return "Password must be at least 10 character long";
    }
    
     if (!/[A-Za-z]/.test(password)) {
        return "Password must contain at least one alphabetic character";
    }

    if (!/\d/.test(password)) {
        return "Password must contain at least one number";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Password must contain at least one special character";
    }

    return "";
}

// function ValidatePhone(phone){
//        const phoneRegex = /^\d{10}$/;  
// }

RegistrationForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = new FormData(RegistrationForm);
    const PasswordErrorShow = document.querySelector(".passwordError");

    const payload = {
        "full_name": formData.get("full_name"),
        "email": formData.get("email"),
        "phone_number": formData.get("phone_number"),
        "date_of_birth": formData.get("date_of_birth"),
        "password": formData.get("password")
    };

    const passwordError = ValidatePassword(payload.password)
    if(passwordError){
        PasswordErrorShow.innerText = passwordError
        return;
    }
    PasswordErrorShow.innerText = "";
    console.log(payload)

    try{

        const response = await fetch("/api/auth/register", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(payload)

        });

        const data = await response.json();

        if (response.ok){
            console.log(data);
            // show verification html page
            window.location.href = "/verify-page";
            localStorage.setItem("email", payload.email)
        }
       
    } catch(error){
        console.log("Error: ", error)
        alert("Something went wrong")
    }

})