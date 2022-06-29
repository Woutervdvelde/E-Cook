const ModalTypes = new Enum('YES_NO', 'OKAY');

const ModalButton = (text, value, color) => {
    return `<button data-value="${value}" class="push-button ${color}">${text}</button>`
}

const ModalTemplateHTML = (title, body) => {
    return `<div class="modal-content">
        <div class="modal-header">
            <h1>${title}</h1>
        </div>
        <div class="modal-body">
            <p>${body}</p>
            <div class="modal-buttons"></div>
        </div>
    </div>`
};

class Modal {
    types = { YES_NO: '1', OKAY: '2' };
    element;
    promiseResolve;

    constructor(title, description, type) {
        this.element = document.createElement('div');
        this.element.id = 'modal';
        this.element.innerHTML = ModalTemplateHTML(title, description);

        switch (type) {
            case ModalTypes.YES_NO:
                this.element.querySelector('.modal-buttons').innerHTML = `${ModalButton('yes', true, 'green')}${ModalButton('no', false, 'red')}`;
                break;
            case ModalTypes.OKAY:
                this.element.querySelector('.modal-buttons').innerHTML = ModalButton('okay', true, 'dark');
                break;
        }

        document.body.appendChild(this.element);
        setTimeout(() => this.element.style.opacity = 1, 0);
    }

    getResponse() {
        return new Promise(resolve => {
            Array.from(this.element.querySelectorAll('button')).map(b => b.onclick = () => {
                resolve(b.dataset.value == 'true');
                this.close();
            });
        });
    }

    close() {
        this.element.parentElement.removeChild(this.element);
    }
}