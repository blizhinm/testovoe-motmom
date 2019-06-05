import EventEmitter from '../../event-emitter';

const addEventFormTemplate = require('../../templates/addEventForm.handlebars');

function isTimeValid(time) {
  return ((/\d{2}:\d{2}/).test(time) && parseInt(time.split(':')[0], 10) <= 23
          && parseInt(time.split(':')[1], 10) <= 59);
}

export default class AddEventForm extends EventEmitter {
  constructor() {
    super();

    this.html = addEventFormTemplate();

    this.render();

    this.$form = $('.add-event-form__form');
    this.$nameInput = this.$form.find('#add-event-form__event-name');
    this.$timeInput = this.$form.find('#add-event-form__event-time');
    this.$cancelButton = this.$form.find('.add-event-form__cancel');

    this.initListeners();
  }

  initListeners() {
    this.$form.on('submit', (e) => {
      e.preventDefault();

      if (this.validateForm()) {
        const name = this.$nameInput.val();
        const time = this.$timeInput.val();
        const newEvent = { id: undefined, time, name };

        this.clearForm();

        this.emit('newEventSubmit', newEvent);
      }
    });

    this.$cancelButton.on('click', (e) => {
      e.preventDefault();

      this.emit('cancelButtonClick');
    });
  }

  validateForm() {
    const time = this.$timeInput.val();

    if (this.$nameInput.val() && time) {
      if (isTimeValid(time)) {
        return true;
      }
      this.$timeInput.focus();
    } else if (!this.$nameInput.val()) {
      this.$nameInput.focus();
    } else if (!this.$timeInput.val()) {
      this.$timeInput.focus();
    }

    return false;
  }

  clearForm() {
    this.$nameInput.val('');
    this.$timeInput.val('');
  }

  render() {
    $('.add-event-form-wrapper').html(this.html);
  }
}
