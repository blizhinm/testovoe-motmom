import EventEmitter from '../../event-emitter';

const timeItemsListTemplate = require('../../templates/timeItem.handlebars');

export default class TimeItem extends EventEmitter {
  constructor(time) {
    super();

    this.time = time;

    this.html = timeItemsListTemplate({
      time,
      attr: time.replace(':', '-'),
    });

    this.$layout = $('.time-panel__list > ul');
    this.$body = null;
  }

  initListeners() {
    this.$body.on('click', () => {
      this.emit('timeClick');
    });
  }

  initControls() {
    this.$body = this.$layout.find(`.time-panel__list-item[data-time=${this.time.replace(':', '-')}]`);

    this.initListeners();
  }

  render() {
    this.$layout.append(this.html);

    this.initControls();
  }
}
