import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { AppComponent } from './app.component';
import { LookupService } from './lookup.service';
import { formatDateString, shiftDaysRawAndConvert } from './util';

@Injectable({
  providedIn: 'root' // Singleton preferred for global utilities
})
export class CoreService {

  rangeToDisplay: number = 2;
  isShuttingDown = false;
  private initialized = false;
  private interf!: AppComponent;
  displayDirectionFront: boolean = false;
  private readonly evs: Array<number> = new Array();
  private dates: Array<string> = [];
  private data = [{
    data: [0],
    label: ""
  }];

  constructor(private lookup: LookupService) {}

  private async loop(iters: number) {
    if(!this.isShuttingDown) {
      this.processEvents();
      return;
    }
  }

  private async updateIfPossible() {
    if(this.displayDirectionFront) {
      for(let nums = 0; nums < this.rangeToDisplay; nums++) {
        let cur = shiftDaysRawAndConvert(this.interf.rawDate, nums);
        let data = await this.lookup.lookupExplicitTimeAbsolute(cur, this.interf.time);
        if(data !== null) {
          if(nums === 0) {
            this.dates.length = 0;
            this.data[0].data.length = 0;
            this.data[0].label = data.metadata.reading_type;
            this.interf.control.plugins.title.text = `Reading type: ${data.metadata.reading_unit}`;
            this.interf.toDisplay = `Reference date: ${formatDateString(cur, "d MMMM y")}`;
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += `Displayed time for all dates: ${this.interf.time}`;
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += "Direction from reference: Forward";
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += `Range displayed (inclusive): ${this.rangeToDisplay}`;
          }

          // Hardcode to Ang Mo Kio station for now
          this.data[0].data.push(data.items[0].readings[1].value);

          this.dates.push(formatDateString(cur, "MMMM d, y"));
          this.interf.updateHandle = [{dates: this.dates, data: this.data}];
        }
      }
    } else {
      for(let nums = 0; nums > -this.rangeToDisplay; nums--) {
        let cur = shiftDaysRawAndConvert(this.interf.rawDate, nums);
        let data = await this.lookup.lookupExplicitTimeAbsolute(cur, this.interf.time);
        if(data !== null) {
          if(nums === 0) {
            this.dates.length = 0;
            this.data[0].data.length = 0;
            this.data[0].label = data.metadata.reading_type;
            this.interf.control.plugins.title.text = `Reading type: ${data.metadata.reading_unit}`;
            this.interf.toDisplay = `Reference date: ${formatDateString(cur, "d MMMM y")}`;
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += `Displayed time for all dates: ${this.interf.time}`;
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += "Direction from reference: Inverse";
            this.interf.toDisplay += "\n";
            this.interf.toDisplay += `Range displayed (inclusive): ${this.rangeToDisplay}`;
          }

          // Hardcode to Ang Mo Kio station for now
          this.data[0].data.push(data.items[0].readings[1].value);

          this.dates.push(formatDateString(cur, "MMMM d, y"));
          this.interf.updateHandle = [{dates: this.dates, data: this.data}];
        }
      }
    }
  }

  private onInputChanged() {
    // Change detected, update display
    this.updateIfPossible();
  }

  private processEvents(): void {
    while(this.evs.length > 0) {
      switch(this.evs.pop()) {
        case 0:
          this.onInputChanged();
          break;
        case 1:
          this.directionChange();
          break;
        case 2:
          this.increment();
          break;
        case 3:
          this.decrement();
          break;
      }
    }
  }

  addToPending(id: number): void {
    this.evs.push(id);
  }

  private directionChange(): void {
    this.displayDirectionFront = !this.displayDirectionFront;
    this.onInputChanged();
  }

  private increment(): void {
    this.rangeToDisplay++;
    this.onInputChanged();
  }

  private decrement(): void {
    // Hardlock to 2 at min for now
    if(this.rangeToDisplay > 2) {
      this.rangeToDisplay--;
      this.onInputChanged();
    }
  }

  init(interf: AppComponent) {
    if(this.initialized) {
      throw new Error('core routines initialized twice, exiting prematurely to avoid corruption');
    } else {
      this.initialized = true;
      this.interf = interf;
      this.onInputChanged();
      timer(0, 1).subscribe(c => this.loop(c));
    }
  }
}
