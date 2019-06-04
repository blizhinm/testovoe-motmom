import EventEmitter from '../../event-emitter';

const eventItemTemplate = require('../../templates/eventItem.handlebars');

export default class EventItem extends EventEmitter {
  constructor(event) {
    super();

    this.eventInfo = event;

    this.selected = false;

    this.html = eventItemTemplate({ event, attr: event.time.replace(':', '-') });

    this.$body = undefined;
    this.$checkbox = undefined;
    this.$deleteButton = undefined;
  }

  initControls() {
    this.$body = $(`.event-item[data-id=${this.eventInfo.id}]`);
    this.$checkbox = this.$body.find('.event-item__checkbox');
    this.$deleteButton = this.$body.find('.event-item__delete-button');

    this.initListeners();
  }

  initListeners() {
    this.$body.on('click', (e) => {
      e.stopPropagation();

      this.emit('eventItemSelect');
    });

    this.$deleteButton.on('click', (e) => {
      e.stopPropagation();

      this.emit('deleteEvent');
    });
  }

  render() {
    $('.event-items-list').append(this.html);

    this.initControls();

    if (this.selected) {
      this.$body.addClass('active');
      $(this.$body.children()[0]).prop('checked', true);
    }
  }
}
