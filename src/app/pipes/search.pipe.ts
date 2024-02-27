import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(timesheets: any[], searchText: string): any[] {
    if (!searchText) {
      return timesheets;
    }

    return timesheets.filter((timesheet) =>
      timesheet.userDetails.username
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }
}
