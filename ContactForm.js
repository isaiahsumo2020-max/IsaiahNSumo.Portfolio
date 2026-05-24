

emailjs.init("Cs9UoNTs3j-eHx-D-");

// Contact Form

document.getElementById("contact-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const subject = document.getElementById("contact-subject");
    const message = document.getElementById("contact-message");

    const successMsg = document.getElementById("form-msg");
    const errorMsg = document.getElementById("form-error");

    let valid = true;

    // RESET
    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");

    document.querySelectorAll(".contact-input").forEach(input => {
        input.classList.remove("border-red-500");
    });

    document.querySelectorAll("[id$='-error']").forEach(el => {
        el.classList.add("hidden");
    });

    // NAME
    if (name.value.trim() === "") {
        valid = false;
        name.classList.add("border-red-500");
        document.getElementById("name-error").classList.remove("hidden");
    }

    // EMAIL
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        valid = false;
        email.classList.add("border-red-500");
        document.getElementById("email-error").classList.remove("hidden");
    }

    // SUBJECT
    if (subject.value.trim() === "") {
        valid = false;
        subject.classList.add("border-red-500");
        document.getElementById("subject-error").classList.remove("hidden");
    }

    // MESSAGE
    if (message.value.trim() === "") {
        valid = false;
        message.classList.add("border-red-500");
        document.getElementById("message-error").classList.remove("hidden");
    }

    // STOP IF INVALID
    if (!valid) {
        errorMsg.classList.remove("hidden");
        return;
    }

    // BUTTON LOADING
    const btn = document.getElementById("contact-submit-btn");

    btn.disabled = true;
    btn.innerHTML = `
      <i class="fas fa-spinner fa-spin text-xs"></i>
      Sending...
    `;

    try {

        // SEND MAIN EMAIL TO YOU
        await emailjs.send("service_x8mdqgk",
            "template_f5t5qfn", {
            from_name: name.value,
            from_email: email.value,
            subject: subject.value,
            message: message.value
        });

        // AUTO REPLY TO VISITOR
        await emailjs.send("service_x8mdqgk", 
            "template_chdydbo", {
            from_name: name.value,
            from_email: email.value
        });

        successMsg.classList.remove("hidden");

        // RESET FORM
        document.getElementById("contact-form").reset();

    } catch (error) {

        errorMsg.innerText = "Failed to send message. Please try again.";
        errorMsg.classList.remove("hidden");

        console.error(error);
    }

    // RESET BUTTON
    btn.disabled = false;
    btn.innerHTML = `
      <i class="fas fa-paper-plane text-xs"></i>
      Send Message
    `;
});
