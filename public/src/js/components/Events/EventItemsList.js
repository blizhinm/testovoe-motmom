import EventEmitter from '../../event-emitter';

import EventItem from './EventItem';

const eventItemsListTemplate = require('../../templates/eventItemsList.handlebars');

export default class EventItemsList extends EventEmitter {
  constructor() {
    super();

    this.html = eventItemsListTemplate();

    this.eventElements = [];
    this.activeElements = [];

    this.createItems();
  }

  sortItems(t) {
    const type = { asc: [-1, 1], desc: [1, -1] };

    this.eventElements.sort((a, b) => {
      const aTime = { h: a.eventInfo.time.split(':')[0], m: a.eventInfo.time.split(':')[1] };
      const bTime = { h: b.eventInfo.time.split(':')[0], m: b.eventInfo.time.split(':')[1] };

      const aTotal = parseInt(aTime.h, 10) * 60 + parseInt(aTime.m, 10);
      const bTotal = parseInt(bTime.h, 10) * 60 + parseInt(bTime.m, 10);

      if (aTotal <= bTotal) {
        return type[t][0];
      }
      return type[t][1];
    });
  }

  createItems() {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const event = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)));
      const eventElement = new EventItem(event);
      this.eventElements.push(eventElement);

      this.activeElements.forEach((el) => {
        if (el.eventInfo.id === event.id) {
          eventElement.selected = true;
          el.eventInfo = event;
        }
      });

      // eventItems Listeners
      eventElement.addListener('deleteEvent', () => {
        console.log(`DELETE!!! ${eventElement.eventInfo.id}`);
        this.removeActive(eventElement);

        this.emit('deleteEvent', event);
        console.log(this.activeElements.map(el => el.eventInfo));
      });
      eventElement.addListener('eventItemSelect', () => {
        console.log(`Clicked!!! ${eventElement.eventInfo.id}`);
        this.toggleItemSelection(eventElement);
      });
    }
  }

  getActiveIndexOf(item) {
    return this.activeElements.map(el => el.eventInfo.id).indexOf(item.eventInfo.id);
  }

  addActive(item) {
    this.activeElements.push(item);
    item.selected = true;
  }

  removeActive(item) {
    this.activeElements.splice(this.getActiveIndexOf(item), 1);
    item.selected = false;
  }

  unselectItems() {
    this.activeElements.forEach((el) => {
      el.$body.removeClass('active');
      $(el.$body.children()[0]).prop('checked', false);
    });

    this.activeElements = [];
  }

  selectItems(time) {
    this.unselectItems();

    this.eventElements.forEach((el) => {
      if (el.eventInfo.time === time) {
        this.toggleItemSelection(el);
      }
    });
  }

  toggleItemSelection(event) {
    const item = event;

    item.$body.toggleClass('active');

    if (this.getActiveIndexOf(item) === -1) {
      this.addActive(item);
    } else {
      this.removeActive(item);
    }

    console.log(this.activeElements);

    const checkVal = $(item.$body.children()[0]).prop('checked');
    $(item.$body.children()[0]).prop('checked', !checkVal);

    this.emit('eventItemSelected', this.activeElements);
  }

  reRenderItems() {
    $('.events-panel__events-form .event-items-list').html('');
    this.eventElements = [];

    this.createItems();
    this.renderItems();
  }

  renderItems() {
    this.sortItems('asc');

    this.eventElements.forEach((el) => {
      el.render();
    });
  }

  render() {
    $('.events-panel__events-form').html(this.html + $('.events-panel__events-form').html());
    this.renderItems();
  }
}
