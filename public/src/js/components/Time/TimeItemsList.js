import EventEmitter from '../../event-emitter';

import TimeItem from './TimeItem';

export default class TimeItemsList extends EventEmitter {
  constructor(timeData) {
    super();

    this.html = '<ul></ul>';
    this.$layout = $('.time-panel__list');

    this.timeItemElements = [];
    this.activeItem = null;

    // Render
    this.$layout.append(this.html);

    this.generateTime(timeData);
    this.renderItems();
  }

  generateTime(timeData) {
    const start = { h: parseInt(timeData.start.split(':')[0], 10), m: parseInt(timeData.start.split(':')[1], 10) };
    const end = { h: parseInt(timeData.end.split(':')[0], 10), m: parseInt(timeData.end.split(':')[1], 10) };

    const startTime = start.h * 60 + start.m;
    const endTime = end.h * 60 + end.m;

    const timeAmount = Math.floor((endTime - startTime) / timeData.period);

    for (let i = 0; i < timeAmount; i += 1) {
      const time = startTime + timeData.period * i;

      let hours = Math.floor(time / 60);

      hours = hours > 9 ? hours : `0${hours}`;

      const minutes = time % 60 > 9 ? time % 60 : `0${time % 60}`;

      const fullTime = `${hours}:${minutes}`;

      const timeElement = new TimeItem(fullTime);

      this.timeItemElements.push(timeElement);

      // Items Listeners
      timeElement.addListener('timeClick', () => {
        this.itemClick(timeElement);
      });
    }
  }

  reRenderItems(timeData) {
    this.timeItemElements = [];
    this.$layout.html(this.html);

    this.generateTime(timeData);

    this.renderItems();
  }

  timeHighlight(highlightInfo) {
    const { time, highlight } = highlightInfo;

    console.log(highlightInfo);

    this.unselectItems();

    if (highlight) {
      const timeEl = this.timeItemElements[this.timeItemElements.findIndex(el => el.time === time)];
      if (timeEl) {
        this.selectItem(timeEl);
      }
    }
  }

  selectItem(item) {
    item.$body.addClass('active disabled');
    this.activeItem = item;
  }

  unselectItems() {
    if (this.activeItem) {
      this.activeItem.$body.removeClass('active disabled');
      this.activeItem = null;
    }
  }

  itemClick(item) {
    if (this.activeItem !== item) {
      this.unselectItems();

      this.selectItem(item);

      this.emit('timeSelected', item.time);
    }
  }

  renderItems() {
    this.timeItemElements.forEach((timeEl) => {
      timeEl.render();

      if (this.activeItem && this.activeItem.time === timeEl.time) {
        this.selectItem(timeEl);
      }
    });
  }
}
