import EventEmitter from '../../event-emitter';

import EventItem from './EventItem';

const eventItemsListTemplate = require('../../templates/eventItemsList.handlebars');

const ASC = 'ascending';


/**
 * Получение даты по переданной строке со временем
 * @param {'HH:mm'} timeString
 */
function getDateByTime(timeString) {
  const [hours, minutes] = timeString.split(':');

  return new Date(0, 0, 0, hours, minutes);
}

export default class EventItemsList extends EventEmitter {
  constructor() {
    super();

    this.html = eventItemsListTemplate();

    this.eventElements = [];
    this.activeElements = [];

    this.createItems();
  }

  sortItems(type) {
    const SORT_TYPE_VALUE = {
      [ASC]: [-1, 1],
      desc: [1, -1],
    }[type];

    this.eventElements.sort((a, b) => {
      const aDate = getDateByTime(a.eventInfo.time);
      const bDate = getDateByTime(b.eventInfo.time);

      if (aDate <= bDate) {
        return SORT_TYPE_VALUE[0];
      }

      return SORT_TYPE_VALUE[1];
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
    return this.activeElements.findIndex(({ eventInfo }) => eventInfo.id === item.eventInfo.id);
    // return this.activeElements.map(el => el.eventInfo.id).indexOf(item.eventInfo.id);
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

    this.eventElements.forEach((event) => {
      if (event.eventInfo.time === time) {
        this.toggleItemSelection(event);
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
    // FIXME: Адресация через классы, а не через относительные функции
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
    this.sortItems(ASC);

    this.eventElements.forEach((el) => {
      el.render();
    });
  }

  render() {
    // FIXME: append, prepend jquery http://api.jquery.com/append/
    $('.events-panel__events-form').html(this.html + $('.events-panel__events-form').html());
    this.renderItems();
  }
}
