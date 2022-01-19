import { Setting } from './manager/setting'

export class State {
  settings: Setting

  constructor() {
    this.settings = new Setting()
  }
}
