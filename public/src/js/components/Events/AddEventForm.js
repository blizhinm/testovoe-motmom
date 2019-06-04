import EventEmitter from '../../event-emitter';

const addEventFormTemplate = require('../../templates/addEventForm.handlebars');


export default class AddEventForm extends EventEmitter {
  constructor() {
    super();

    this.html = addEventFormTemplate();

    this.$form = undefined;

    this.$nameInput = undefined;
    this.$timeInput = undefined;

    this.$cancelButton = undefined;
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
    if (this.$nameInput.val().length && this.$timeInput.val().length) {
      // FIXME: Вынести в отдельный метод и вызвать его здесь
      if ((/\d{2}:\d{2}/).test(this.$timeInput.val()) && parseInt(this.$timeInput.val().split(':')[0], 10) <= 23
          && parseInt(this.$timeInput.val().split(':')[1], 10) <= 59) {
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

  initControls() {
    this.$form = $('.add-event-form__form');
    this.$nameInput = $('#add-event-form__event-name');
    this.$timeInput = $('#add-event-form__event-time');
    this.$cancelButton = $('.add-event-form__cancel');

    this.initListeners();
  }

  render() {
    $('.add-event-form-wrapper').html(this.html);

    this.initControls();
  }
}
