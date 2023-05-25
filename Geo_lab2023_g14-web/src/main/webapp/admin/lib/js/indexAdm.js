function hideForm(formId) {
    let form = document.getElementById(formId);
    if (form) {
        form.style.display = 'none';
    }
}

function showForm(formId) {
    let forms = document.querySelectorAll('[id^="form"]');
    for (let i = 0; i < forms.length; i++) {
        let form = forms[i];
        if (form.id === formId) {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }
}
