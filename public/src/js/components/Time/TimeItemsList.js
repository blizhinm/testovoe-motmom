import EventEmitter from '../../event-emitter';

import TimeItem from './TimeItem';

export default class TimeItemsList extends EventEmitter {
  constructor(timeData) {
    super();

    this.html = '<ul></ul>';

    this.timeItemElements = [];
    this.activeItem = null;

    this.generateTime(timeData);


    this.activeSelection = [];
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

      hours = hours >= 10 ? hours : `0${hours}`;

      const minutes = time % 60 >= 10 ? time % 60 : `0${time % 60}`;

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
    $('.time-panel__list ul').html('');

    this.generateTime(timeData);

    this.renderItems();
  }

  timeHighlight(highlightInfo) {
    const { time, highlight } = highlightInfo;

    console.log(highlightInfo);

    this.unselectItems();

    if (highlight) {
      const timeEl = this.timeItemElements[this.timeItemElements.map(el => el.time).indexOf(time)];
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
    this.timeItemElements.forEach((time) => {
      time.render();
      if (this.activeItem && this.activeItem.time === time.time) {
        this.selectItem(time);
      }
    });
  }

  render() {
    $('.time-panel__list').append(this.html);
    this.renderItems();
  }
}
