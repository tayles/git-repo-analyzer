import { Window } from 'happy-dom';

const window = new Window({
  url: 'http://localhost/',
});
global.window = window as any;
global.document = window.document as any;
global.navigator = window.navigator as any;
global.history = window.history;
global.location = window.location as any;
