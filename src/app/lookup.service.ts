import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadonlyDate, LookupResult } from './lookup.defs';
import { firstValueFrom, from } from 'rxjs';

@Injectable({
  providedIn: 'root' // Singleton preferred for global utilities
})
export class LookupService {

  /*
   * From the API reference:
   * Request endpoint: https://api.data.gov.sg/v1/environment/{data_type}?date_time={date_time}
   * date_time is (string, optional) or
   * https://api.data.gov.sg/v1/environment/{data_type}?date={date}
   * date is (string, optional)
   * Latest available data at that moment in time. Format follows YYYY-MM-DD[T]HH:mm:ss, for example:
   * 2016-12-12T09:45:00, or just YYYY-MM-DD, for example 2016-12-12
   * Time is listed in a 24 hour format
   */
  readonly requestDayOnly = 'https://api.data.gov.sg/v1/environment/rainfall?date=';
  readonly request = 'https://api.data.gov.sg/v1/environment/rainfall?date_time=';

  constructor(private hook: HttpClient) {}

  async lookupIgnoreTime(timeIgnoredDate: ReadonlyDate): Promise<LookupResult | null> {

    let response = await firstValueFrom(this.hook.get<LookupResult>(
      `${this.requestDayOnly}${timeIgnoredDate.toISOString().substring(0, 10)}`,
      {observe: 'response'}));
      // Request full response instead of just the data body
      

      if(response.ok) {
        // console.log(response.body);
        return response.body;
      } else { // Error handling
        /*
         * From the Angular documentation on error handling:
         *
         * The server backend might reject the request, returning a HTTP response with a status code
         * such as 404 or 500. These are error responses.
         *
         * Something could go wrong on the client-side such as a network error that prevents the request
         * from completing successfully or an exception thrown in an RxJS operator. These errors have
         * status set to 0 and the error property contains a ProgressEvent object, whose type might
         * provide further information.
         * 
         * Angular captures both kinds of errors in the HttpErrorResponse object. Inspect that 
         * response to identify the error's cause.
         * 
         * Since Angular replaces certain errors with a special object and a 0 status code, these
         * instances need special handling when encountered
         */
        if(response.status == 0) {
          
        }
        return null;
      }
  }

  async lookupExplicitTimeAbsolute(timeIgnoredDate: ReadonlyDate, time: string): Promise<LookupResult | null> {

    // console.log(`${timeIgnoredDate.toISOString().substring(0, 11)}${time}`);

    let response = await firstValueFrom(
      this.hook.get<LookupResult>(`${this.request}${timeIgnoredDate.toISOString().substring(0, 11)}${time}`,
      {observe: 'response'}));
      // Request full response instead of just the data body

      if(response.ok) {
        // console.log(response.body);
        return response.body;
      } else { // Error handling
        /*
         * From the Angular documentation on error handling:
         *
         * The server backend might reject the request, returning a HTTP response with a status code
         * such as 404 or 500. These are error responses.
         *
         * Something could go wrong on the client-side such as a network error that prevents the request
         * from completing successfully or an exception thrown in an RxJS operator. These errors have
         * status set to 0 and the error property contains a ProgressEvent object, whose type might
         * provide further information.
         * 
         * Angular captures both kinds of errors in the HttpErrorResponse object. Inspect that 
         * response to identify the error's cause.
         * 
         * Since Angular replaces certain errors with a special object and a 0 status code, these
         * instances need special handling when encountered
         */
        if(response.status == 0) {
          
        }
        return null;
      }
  }

  async lookup(date: ReadonlyDate): Promise<LookupResult | null> {

    // console.log(`${date.toISOString().substring(0, 19)}`);

    let response = await firstValueFrom(
      this.hook.get<LookupResult>(`${this.request}${date.toISOString().substring(0, 19)}`,
      {observe: 'response'}));
      // Request full response instead of just the data body

      if(response.ok) {
        // console.log(response.body);
        return response.body;
      } else { // Error handling
        /*
         * From the Angular documentation on error handling:
         *
         * The server backend might reject the request, returning a HTTP response with a status code
         * such as 404 or 500. These are error responses.
         *
         * Something could go wrong on the client-side such as a network error that prevents the request
         * from completing successfully or an exception thrown in an RxJS operator. These errors have
         * status set to 0 and the error property contains a ProgressEvent object, whose type might
         * provide further information.
         * 
         * Angular captures both kinds of errors in the HttpErrorResponse object. Inspect that 
         * response to identify the error's cause.
         * 
         * Since Angular replaces certain errors with a special object and a 0 status code, these
         * instances need special handling when encountered
         */
        if(response.status == 0) {
          
        }
        return null;
      }
  }
}
