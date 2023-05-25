function hideForm(formId) {
    let form = document.getElementById(formId);
    if (form) {
        form.style.display = 'none';
    }
}

function showForm(formId) {
    let form = document.getElementById(formId);
    if (form) {
        form.style.display = 'block';
    }
}