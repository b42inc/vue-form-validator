"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
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
    if (!HTMLInputElement.prototype.reportValidity) {
        HTMLInputElement.prototype.reportValidity = function () {
            var _this = this;
            if (this.checkValidity())
                return true;
            var form = this.form;
            var isTemp = false;
            if (!form) {
                form = document.createElement('form');
                form.style.display = 'inline';
                this.before(form);
                form.append(this);
                isTemp = true;
            }
            var siblings = Array
                .from(form.elements)
                .filter(function (input) { return input !== _this && input instanceof HTMLInputElement && !!input.checkValidity && !input.disabled; });
            siblings.forEach(function (input) { return (input.disabled = true); });
            form.reportValidity();
            siblings.forEach(function (input) { return (input.disabled = false); });
            if (isTemp) {
                form.before(this);
                form.remove();
            }
            this.focus();
            this.selectionStart = 0;
            return false;
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
});
