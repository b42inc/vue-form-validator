export default () => {
    if (!HTMLFormElement.prototype.requestSubmit) {
        HTMLFormElement.prototype.requestSubmit = function(submitter: HTMLInputElement | undefined) {
            if (submitter) {
                submitter.click();
                return
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
        HTMLInputElement.prototype.reportValidity = function(){
            if (this.checkValidity()) return true
            var form = this.form;
            var isTemp = false;
            if (!form) {
                form = document.createElement('form');
                form.style.display = 'inline';
                this.before(form);
                form.append(this);
                isTemp = true
            }
            var siblings = Array
                .from(form.elements)
                .filter((input) => input !== this && input instanceof HTMLInputElement && !!input.checkValidity && !input.disabled) as HTMLInputElement[];
            siblings.forEach((input) => (input.disabled = true));
            form.reportValidity();
            siblings.forEach((input) => (input.disabled = false));
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
        HTMLFormElement.prototype.reportValidity = function() {
            if (this.checkValidity()){
                return true;
            }
            if (this.noValidate){
                this.noValidate = false;
                this.requestSubmit();
                this.noValidate = true;
            } else {
                this.requestSubmit();
            }
            return false;
        };
    }
}
