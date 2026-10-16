// Test-only observer; all behavior and prompts use the real browser rules.
import { LocalMatch as BrowserMatch } from '../web/local/session.js';
import { Card } from '../web/local/models.js';
export class LocalMatch extends BrowserMatch {
  constructor(options) { super(options); window.__skillMatch = this; window.__skillCard = value => new Card(value.name, value.type, value); }
}

export {SAVE_KEY} from '../web/local/session.js';
