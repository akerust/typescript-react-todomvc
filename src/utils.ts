export function uuid(): string {
  var i, random;
  var uuid = '';
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }
  return uuid;
}

export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  var store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

export function extend(...objs: any[]): any {
  var newObj: any = {};
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}

export class Future<T> {
    private promise: Promise<T>;
    private isRunning = true;

    setResult: (value?: T | PromiseLike<T>) => void;
    setException: (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.setResult = (value?: T | PromiseLike<T>) => {
                this.isRunning = false;
                resolve(value);
            };
            this.setException = (reason?: any) => {
                this.isRunning = false;
                reject(reason);
            };
        });
    }

    running() {
        return this.isRunning;
    }

    done() {
        return !this.isRunning;
    }

    result() {
        return this.promise;
    }
}
