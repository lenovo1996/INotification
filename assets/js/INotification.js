class INotification {
    constructor() {
        this.prefixClass = 'INotification';

        this.defaultSettings = {
            type: 'default',
            title: '',
            description: '',
            timeOut: 3000,
            position: 'bottom-right',
            animation: 'slide',
            theme: 'white',
            buttons: {
                visible: true,
                apply: {
                    text: 'Apply',
                    callback: () => { return;}
                },
                dismiss: {
                    text: 'Dismiss',
                    callback: () => { return;}
                }
            }
        };

        this.position = [
            'top-right',
            'top-left',
            'bottom-right',
            'bottom-left'
        ];

        this.type = [
            'default',
            'success',
            'info',
            'warning',
            'danger',
            'error'
        ];

        this.animation = [
            'slide',
            'fade'
        ];

        this.theme = [
            'light',
            'dark',
            'colored'
        ];

        this.settings = {};
    }

    checkPosition(position) {
        if (this.position.indexOf(position) < 0) {
            throw `Not support this position [${position}]. Please use [${this.position}]`;
        }
    }

    checkType(type) {
        if (this.type.indexOf(type) < 0) {
            throw `Not support this type [${type}]. Please use [${this.type}]`;
        }
    }

    checkAnimationType(animation) {
        if (this.animation.indexOf(animation) < 0) {
            throw `Not support this animation [${animation}]. Please use [${this.animation}]`;
        }
    }

    checkThemeType(theme) {
        if (this.theme.indexOf(theme) < 0) {
            throw `Not support this theme [${theme}]. Please use [${this.theme}]`;
        }
    }

    checkTimeOutFormat(timeOut) {
        if (typeof timeOut !== 'number' && typeof timeOut !== 'boolean') {
            throw 'timeOut incorrect format. Please use number or boolean';
        }
    }

    html() {
        return `<div data-animation="${this.settings.animation}" data-position="${this.settings.position}" class="${this.prefixClass} ${this.prefixClass}--${this.settings.type} position-${this.settings.position} ${this.prefixClass}--close-on-click animation-${this.settings.animation}-in ${this.prefixClass}--image">` +
            `<span class="${this.prefixClass}__close">` +
            `<span class="${this.prefixClass}__close-icon"></span>` +
            `</span>` +
            `<div class="${this.prefixClass}__body">` +
            `<div class="${this.prefixClass}__image"></div>` +
            `<div class="${this.prefixClass}__content">` +
            `<div class="${this.prefixClass}__title">${this.settings.title}</div>` +
            `<div class="${this.prefixClass}__desc">${this.settings.description}</div>` +
            `</div>` +
            `</div>` +
            `<div class="${this.prefixClass}__buttons">` +
            `<span class="${this.prefixClass}__button ${this.prefixClass}__button--action">Ok</span>` +
            `<span class="${this.prefixClass}__button ${this.prefixClass}__button--cancel">dismiss</span>` +
            `</div>` +
            `</div>`;
    }

    notify(settings) {
        if (typeof settings !== 'object') {
            throw 'Parameter setting is not a object';
        }

        Object.keys(this.defaultSettings).forEach((key) => {
            this.settings[key] = this.defaultSettings[key];
            if (typeof settings[key] != 'undefined') {
                /* check value of position */
                if (key == 'position') {
                    this.checkPosition(settings[key]);
                }

                /* check value of type */
                if (key == 'type') {
                    this.checkType(settings[key]);
                }

                /* check format of timeOut */
                if (key == 'timeOut') {
                    this.checkTimeOutFormat(settings[key]);
                }

                /* check value of animation */
                if (key == 'animation') {
                    this.checkAnimationType(settings[key]);
                }

                /* check value of theme */
                if (key == 'theme') {
                    this.checkThemeType(settings[key]);
                }

                this.settings[key] = settings[key];
            }
        });
        document.body.innerHTML += this.html();
        this.setPositionNotification();
        this.addEventListenerWhenClickClose();
    }

    addEventListenerWhenClickClose() {
        let notificationList = document.getElementsByClassName(`${this.prefixClass}__close`);

        /* check event click close icon */
        for (let i = notificationList.length - 1; i >= 0; i--) {
            let notification = notificationList[i];
            notification.addEventListener("click", (item) => {
                let animationType = notification.parentNode.getAttribute('data-animation');
                notification.parentNode.classList.add(`animation-${animationType}-out`);
                setTimeout(() => {
                    notification.parentNode.remove();
                    this.setPositionNotification();
                }, 50);
            });
        }
    }

    setPositionNotification() {
        let notificationList = document.querySelectorAll('.' + this.prefixClass);
        var margin = 20;

        let positionTop = {
            'top-right': {position: 20, index: 0},
            'top-left': {position: 20, index: 0},
            'bottom-right': {position: 20, index: 0},
            'bottom-left': {position: 20, index: 0},
        };

        for (let i = notificationList.length - 1; i >= 0; i--) {
            let notification = notificationList[i];
            /* get animation type of notification */
            let animationType = notification.getAttribute('data-animation');
            /* get position type of notification */
            let positionType = notification.getAttribute('data-position');
            let position = positionType.split('-');

            positionTop[positionType]['position'] += positionTop[positionType]['index'] == 0 ? 0 : notification.clientHeight + margin;
            positionTop[positionType]['index']++;
            notification.setAttribute("style", `${position[0]}: ${positionTop[positionType]['position']}px; ${position[1]}: ${margin}px;`);

            if (i == notificationList.length - 1) {
                setTimeout(function () {
                    notification.classList.remove(`animation-${animationType}-in`);
                }, 200);
            } else {
                notification.classList.remove(`animation-${animationType}-in`);
            }
        }
    }
}

