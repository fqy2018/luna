/**
 * 控制页面的搜索框
 *
 *
 * @date     2017-11-07
 * @author   liuzheng <liuzheng712@gmail.com>
 */
import {Component, OnChanges, Input, Pipe, PipeTransform} from '@angular/core';

import {Logger} from 'angular2-logger/core';

import {AppService, DataStore, HttpService} from '../../app.service';

export let Q: string = '';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnChanges {

  @Input() input;
  searchrequest: any;

  constructor(private _appService: AppService,
              private _http: HttpService,
              private _logger: Logger) {
    this._logger.log('LeftbarComponent.ts:SearchBar');
  }

  ngOnChanges(changes) {
    Q = changes.input.currentValue;
  }

  modelChange($event) {
    this.Search(Q)
  }

  public Search(q) {
    if (this.searchrequest) {
      this.searchrequest.unsubscribe();
    }
    this.searchrequest = this._http.get('/api/search?q=' + q)
      .map(res => res.json())
      .subscribe(
        data => {
          this._logger.log(data);
        },
        err => {
          this._logger.error(err);
        },
        () => {
        }
      );
    this._logger.log(q)
  }
}


@Pipe({name: 'SearchFilter'})
export class SearchFilter implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {
      input = input.toLowerCase();
      return value.filter(function (el: any) {
        return el.name.toLowerCase().indexOf(input) > -1 || el.comment.toLocaleLowerCase().indexOf(input) > -1;
      })
    }
    return value;
  }
}
