export function getFormattedDate(date) {
  /**Both codes below work for formatting the date as well.
  toISOString() is a built in method on date objects, which 
  converts or returns a date as a string value in ISO format.*/
  //return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return date.toISOString().slice(0, 10);
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
