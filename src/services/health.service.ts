import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {Status} from "../models/status";

@Injectable({
  providedIn: "root"
})
export class HealthService {

  constructor(private httpClient: HttpClient) {}

  getStatus(url : string): Observable<Status> {
    const headers = new HttpHeaders()
      .append("Content-Type", "application/json")
      .append("Access-Control-Allow-Origin", "*")
      .append("'Access-Control-Allow-Credentials", "true");
    return this.httpClient
      .get<Status>(url, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
