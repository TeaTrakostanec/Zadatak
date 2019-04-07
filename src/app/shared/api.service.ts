import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  public API_KEY: string = '39de841bd0bc8ce9d5a0fc3aa3f03c93ed568dbdf232a9ed9661336766d4293';

  constructor(private http: HttpClient) { }

  public getData() {
    return this.http.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR,HRK&api_key=˛${this.API_KEY}`
    )
  }

}
