export default {
  events: {
    generateEvents(amount, wordsNum) {
      window.localStorage.clear();
      const getRndm = (min, max) => Math.floor(Math.random() * (max - min) + min);
      const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur,', 'adipisicing', 'elit.', 'Porro,', 'cumque?', 'Maxime', 'vero', 'corporis', 'ad', 'itaque', 'error', 'corrupti', 'quia', 'aliquid', 'minima', 'quam', 'recusandae', 'assumenda', 'nisi', 'illo,', 'quis', 'sequi', 'nemo', 'dicta', 'dolores.', 'Optio', 'quidem', 'perferendis', 'molestiae', 'porro', 'doloremque', 'culpa', 'repudiandae', 'dolor', 'suscipit', 'accusantium', 'voluptatum!', 'Neque', 'explicabo', 'perferendis', 'reprehenderit,', 'ex', 'consequuntur', 'quod', 'ut', 'error', 'pariatur', 'quisquam', 'eos,', 'aperiam', 'dolore', 'voluptatibus', 'labore', 'porro', 'maxime.', 'Rem', 'quas', 'obcaecati', 'voluptatum,', 'sequi', 'voluptatem', 'saepe', 'molestias,', 'beatae', 'placeat', 'delectus', 'numquam', 'et', 'nesciunt', 'cupiditate'];
      let count = 0;
      for (let i = 0; i < words.length; i += 1) {
        if (count < amount) {
          const hRnd = getRndm(0, 24);
          const mRnd = getRndm(0, 24);
          const time = { h: hRnd < 10 ? `0${hRnd}` : hRnd, m: mRnd < 10 ? `0${mRnd}` : mRnd };
          let str = '';
          for (let j = 0; j < wordsNum; j += 1) {
            str += j !== wordsNum - 1 ? `${words[getRndm(0, words.length)]} ` : words[getRndm(0, words.length)];
          }
          const id = this.getUuidv4();
          window.localStorage.setItem(id, JSON.stringify({ id, time: `${time.h}:${time.m}`, name: str }));
        } else {
          break;
        }
        count += 1;
      }
    },
    addEvent(event) {
      return new Promise((resolve) => {
        const newEvent = event;
        const newID = this.getUuidv4();
        newEvent.id = newID;

        window.localStorage.setItem(newEvent.id, JSON.stringify(newEvent));

        resolve();

        this.logEvents();
      });
    },
    getUuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0; const
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    deleteEvent(event) {
      return new Promise((resolve) => {
        if (confirm(`Delete event: ${JSON.stringify(event)} ?`)) {
          this.logEvents();
          window.localStorage.removeItem(event.id);

          this.logEvents();

          resolve();
        }
      });
    },
    updateEvents(ids, time) {
      return new Promise((resolve) => {
        ids.forEach((id) => {
          const event = JSON.parse(window.localStorage.getItem(id));
          event.time = time;
          window.localStorage.setItem(id, JSON.stringify(event));
        });

        this.logEvents();

        resolve();
      });
    },
    logEvents() {
      const arr = [];

      for (let i = 0; i < window.localStorage.length; i += 1) {
        const event = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)));
        arr.push(event);
      }

      console.log(arr);
    },
  },
};
