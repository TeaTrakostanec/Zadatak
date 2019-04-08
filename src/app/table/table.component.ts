import { Component, OnInit, ɵConsole } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ExcelService } from '../shared/excel-service.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public cyrptoData = [];
  public currencies = [];

  public rowsShown: number = 10;

  public chart;

  public chartCurrencyData = {};

  public xAxisLables: Array<string> = [];

  private labelColor = {
    BTC: '#061b3d',
    ETH: '#d94511'
  };

  constructor(private api: ApiService, private excelSerivce: ExcelService) { }

  ngOnInit() {

    this.showData();
    let subs = Observable.interval(15000).subscribe(x => {
      this.showData();
    })

    setTimeout(() => subs.unsubscribe(), 1000 * 60 * 60);
  }

  showMoreRows() {
    if (this.rowsShown < this.cyrptoData.length) {
      this.rowsShown += 2;
    }
  }


  exportToXslx() {
    this.excelSerivce.exportAsExcelFile(this.cyrptoData.map(row => {
      let object = { crypto: row.cryptoName };
      for (let currency of this.currencies) {
        object[currency] = row.cryptoValue[currency]
      }

      return object;

    }), 'crypto');
  }

  public showData() {
    this.api.getData().subscribe((data: any) => {

      // create x-axis for chart
      let date = moment().format('HH:mm:ss');
      // push date to arr
      this.xAxisLables.push(date);


      for (let crypto in data) { // iterate through all propertie names in object (names = dash/eth)

        let dataCrypto = data[crypto];

        // get all currencies from response (table headers)
        if (this.currencies.length == 0) {
          this.currencies = Object.keys(dataCrypto); // return arr of currency names

          // init object for chart data
          // create property for every currency
          for (let currency of this.currencies) { // iterate through curencies in arr
            this.chartCurrencyData[currency] = {}; // add new property (currency == usd, eur...) to chartCurrencyData object
          }
        }

        // display data for table
        this.cyrptoData.push({ cryptoName: crypto, cryptoValue: dataCrypto });

        //arr for chart display (chartCrypto - given currency) (crypto - crypto value)
        for (let chartCrypto in this.chartCurrencyData) {

          if (this.chartCurrencyData[chartCrypto][crypto] === undefined) {
            this.chartCurrencyData[chartCrypto][crypto] = [];
          }
          this.chartCurrencyData[chartCrypto][crypto].push(
            {
              x: date,
              y: dataCrypto[chartCrypto] // given currency value
            }
          )
        }
      }

      // create object for chart (chart.js)
      for (let currency in this.chartCurrencyData) {
        let array = [];

        for (let crypto in this.chartCurrencyData[currency]) {
          array.push({
            data: this.chartCurrencyData[currency][crypto],
            borderColor: this.labelColor[crypto],
            fill: false,
            label: currency + ' to ' + crypto
          });
        }

        this.chart = new Chart('canvas' + currency, {
          type: 'line',
          data: {
            labels: this.xAxisLables,
            datasets: array,
            backgroundColor: 'rgba(0, 0, 0, 0)'
          },
          options: {
            legend: {
              display: true,
              tooltips: { enabled: false },
              hover: { mode: null },
              events: []
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });
      }

    });
  }

}
