"use strict";
if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function () {
        var submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.hidden = true;
        this.appendChild(submitBtn);
        submitBtn.click();
        this.removeChild(submitBtn);
    };
}
if (!HTMLFormElement.prototype.reportValidity) {
    HTMLFormElement.prototype.reportValidity = function () {
        if (this.checkValidity()) {
            return true;
        }
        if (this.noValidate) {
            this.noValidate = false;
            this.requestSubmit();
            this.noValidate = true;
        }
        else {
            this.requestSubmit();
        }
        return false;
    };
}
if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function (submitter) {
        if (submitter) {
            submitter.click();
            return;
        }
        submitter = document.createElement('input');
        submitter.type = 'submit';
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
    };
}
