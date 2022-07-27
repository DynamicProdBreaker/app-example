import { formatDate } from "@angular/common";
import { debugMode } from "./global.defs";

export function formatDateString(d: Date, format: string) {
    return formatDate(d, format, "en-US", "UTC");
}

export function dateFrom(year: number, month: number, date: number,
  hours: number, minutes: number, seconds: number) {
    // Typescript dates start with 0 indexed months
    // SST is 8 hours ahead of UTC
    return new Date(year, month - 1, date, hours + 8, minutes, seconds);
}

export function rawToExpected(date: Date) {
    date = new Date(date);
    date.setHours(date.getHours() + 8);
    return date;
}

export function shiftDaysRawAndConvert(date: Date, numDays: number) {
    date = new Date(date);
    date.setHours(date.getHours() + (24 * numDays));
    return rawToExpected(date);
}

export function debug(toLog: any, noisy: boolean = false) {
    if(!noisy) {
        console.debug(toLog);
    } else {
        if(debugMode) {
            alert(toLog);
        }
    }
}