import { Window } from 'happy-dom';

const window = new Window({
  url: 'http://localhost/',
});
global.window = window as any;
global.document = window.document;
global.navigator = window.navigator;
global.history = window.history;
global.location = window.location;
