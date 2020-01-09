export class Timer {
  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
