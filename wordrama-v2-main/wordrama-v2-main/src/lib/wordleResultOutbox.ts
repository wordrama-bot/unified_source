const DB_NAME = 'wordrama-result-outbox';
const DB_VERSION = 1;
const STORE_NAME = 'results';
const PLAYER_INDEX = 'playerId';

export type PendingWordleResult = {
  resultId: string;
  playerId: string;
  clientCompletedAt: string;
  clientBuild?: string;
  solution: string;
  guesses: string[];
  gameWasHardMode: boolean;
  type: string;
  wordPack: string;
  shareCode?: string;
  queuedAt: string;
};

function openOutboxDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      const store = db.objectStoreNames.contains(STORE_NAME)
        ? request.transaction!.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, {
            keyPath: 'resultId',
          });

      if (!store.indexNames.contains(PLAYER_INDEX)) {
        store.createIndex(
          PLAYER_INDEX,
          'playerId',
          { unique: false },
        );
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(
        request.error ??
          new Error('Unable to open Wordle result outbox'),
      );
    };
  });
}

export async function queueWordleResult(
  result: Omit<PendingWordleResult, 'queuedAt'>,
): Promise<void> {
  const db = await openOutboxDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readwrite',
      );

      transaction.objectStore(STORE_NAME).put({
        ...result,
        queuedAt: new Date().toISOString(),
      });

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error('Unable to queue Wordle result'),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error('Wordle result queue transaction aborted'),
        );
      };
    });
  } finally {
    db.close();
  }
}

export async function getPendingWordleResults(
  playerId: string,
): Promise<PendingWordleResult[]> {
  const db = await openOutboxDb();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(STORE_NAME)
        .index(PLAYER_INDEX)
        .getAll(playerId);

      request.onsuccess = () => {
        const results = (
          request.result as PendingWordleResult[]
        ).sort((a, b) =>
          a.queuedAt.localeCompare(b.queuedAt),
        );

        resolve(results);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error('Unable to read Wordle result outbox'),
        );
      };
    });
  } finally {
    db.close();
  }
}

export async function removeWordleResult(
  resultId: string,
): Promise<void> {
  const db = await openOutboxDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readwrite',
      );

      transaction.objectStore(STORE_NAME).delete(resultId);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error('Unable to remove Wordle result'),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error('Wordle result removal transaction aborted'),
        );
      };
    });
  } finally {
    db.close();
  }
}

export async function getPendingWordleResultCount(
  playerId: string,
): Promise<number> {
  const db = await openOutboxDb();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(STORE_NAME)
        .index(PLAYER_INDEX)
        .count(playerId);

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        reject(
          request.error ??
            new Error('Unable to count pending Wordle results'),
        );
      };
    });
  } finally {
    db.close();
  }
}
