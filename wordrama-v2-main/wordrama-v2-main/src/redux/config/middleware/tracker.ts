const dictionary: Record<
  string,
  {
    last: number;
    avgCallMs: number;
    maxCallMs: number;
    calls: number[];
    callDurations: number[];
    errors: any[];
  }
> = {};

function sum(a) {
  return a.reduce((c, v) => c + v, 0);
}

function average(a) {
  return sum(a) / a.length;
}

const tracker = (/*store*/) => (next) => (action) => {
  const timestamp = Date.now();

  if (!dictionary[action.type]) {
    dictionary[action.type] = {
      last: timestamp,
      avgCallMs: 0,
      maxCallMs: 0,
      calls: [],
      callDurations: [],
      errors: [],
    };
  }

  const delta = timestamp - dictionary[action.type].last;

  dictionary[action.type].calls.push(delta);

  if (action.type.includes('fulfilled')) {
    const a = action.type.replace('/fulfilled', '/pending');
    const dur = timestamp - dictionary[a].last;
    dictionary[action.type].callDurations.push(dur);
    dictionary[action.type].avgCallMs = average(
      dictionary[action.type].callDurations,
    );

    if (dictionary[action.type].maxCallMs < dur) {
      dictionary[action.type].maxCallMs = dur;
    }
  }

  dictionary[action.type].last = timestamp;

  if (action.type.includes('rejected')) {
    dictionary[action.type].errors.push(action);
  }

  return next(action);
};

export const debugTracker = () => {
  return Object.keys(dictionary).reduce((c, v) => {
    if (v.indexOf('pending') === -1) {
      const o = {
        ...dictionary[v],
        last: new Date(dictionary[v].last).toString(),
        count: dictionary[v].calls.length,
      };

      delete o.calls;
      c[v] = o;
    }
    return c;
  }, {});
};

export const filterActions = (filters: string[] = []) => {
  const filtered = Object.keys(dictionary)
    .filter((action) => filters.find((filter) => action.includes(filter)))
    .filter((action) => !action.includes('/pending'));

  return filtered;
};

export const numberOfCalls = (filters: string[]) => {
  return sum(
    filterActions(filters).map((action) => dictionary[action].calls.length),
  );
};

export const averageMsCalls = (filters: string[]) => {
  return average(
    filterActions(filters).map((action) => dictionary[action].avgCallMs),
  );
};

export const maxMsCalls = (filters: string[]) => {
  const max = filterActions(filters).map(
    (action) => dictionary[action].maxCallMs,
  );
  return Math.max.apply(null, max.length ? max : [0]);
};

export default tracker;
