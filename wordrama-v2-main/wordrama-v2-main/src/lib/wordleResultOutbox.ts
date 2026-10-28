const DB_NAME = 'wordrama-result-outbox';
const DB_VERSION = 3;
const STORE_NAME = 'results';
const COMPLETION_STORE_NAME = 'completions';
const CHECKPOINT_STORE_NAME = 'checkpoints';
const PLAYER_INDEX = 'playerId';

export type PendingWordleResult = {
  resultId: string;
  gameInstanceId?: string;
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

export type WordleLocalCheckpoint = {
  playerId: string;
  revision: number;
  savedAt: string;
  gameState: Record<string, unknown>;
  pendingRemoteSync: boolean;
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

      if (!db.objectStoreNames.contains(COMPLETION_STORE_NAME)) {
        const completionStore = db.createObjectStore(
          COMPLETION_STORE_NAME,
          { keyPath: 'resultId' },
        );

        completionStore.createIndex(
          PLAYER_INDEX,
          'playerId',
          { unique: false },
        );
      }

      if (!db.objectStoreNames.contains(CHECKPOINT_STORE_NAME)) {
        db.createObjectStore(CHECKPOINT_STORE_NAME, {
          keyPath: 'playerId',
        });
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
        [STORE_NAME, COMPLETION_STORE_NAME],
        'readwrite',
      );

      const record: PendingWordleResult = {
        ...result,
        queuedAt: new Date().toISOString(),
      };

      // Both writes succeed together or the transaction aborts.
      // The result outbox and recovery journal cannot diverge
      // during initial queueing.
      transaction.objectStore(STORE_NAME).put(record);
      transaction.objectStore(COMPLETION_STORE_NAME).put(record);

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

export async function getWordleCompletions(
  playerId: string,
): Promise<PendingWordleResult[]> {
  const db = await openOutboxDb();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(
        COMPLETION_STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(COMPLETION_STORE_NAME)
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
            new Error('Unable to read Wordle completion journal'),
        );
      };
    });
  } finally {
    db.close();
  }
}

export async function saveWordleLocalCheckpoint(
  checkpoint: WordleLocalCheckpoint,
): Promise<void> {
  const db = await openOutboxDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        CHECKPOINT_STORE_NAME,
        'readwrite',
      );

      const store = transaction.objectStore(
        CHECKPOINT_STORE_NAME,
      );

      const request = store.get(checkpoint.playerId);

      request.onsuccess = () => {
        const existing =
          request.result as WordleLocalCheckpoint | undefined;

        // An older asynchronous write must not replace
        // a newer locally persisted checkpoint.
        if (
          !existing ||
          checkpoint.revision > existing.revision
        ) {
          store.put(checkpoint);
        }
      };

      request.onerror = () => {
        transaction.abort();
      };

      transaction.oncomplete = () => resolve();

      transaction.onerror = () =>
        reject(
          transaction.error ??
            new Error('Unable to save Wordle local checkpoint'),
        );

      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error('Wordle local checkpoint transaction aborted'),
        );
    });
  } finally {
    db.close();
  }
}

export async function getWordleLocalCheckpoint(
  playerId: string,
): Promise<WordleLocalCheckpoint | undefined> {
  const db = await openOutboxDb();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(
        CHECKPOINT_STORE_NAME,
        'readonly',
      );

      const request = transaction
        .objectStore(CHECKPOINT_STORE_NAME)
        .get(playerId);

      request.onsuccess = () =>
        resolve(
          request.result as WordleLocalCheckpoint | undefined,
        );

      request.onerror = () =>
        reject(
          request.error ??
            new Error('Unable to read Wordle local checkpoint'),
        );
    });
  } finally {
    db.close();
  }
}

export async function acknowledgeWordleLocalCheckpoint(
  playerId: string,
  revision: number,
): Promise<void> {
  const db = await openOutboxDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(
        CHECKPOINT_STORE_NAME,
        'readwrite',
      );

      const store = transaction.objectStore(
        CHECKPOINT_STORE_NAME,
      );

      const request = store.get(playerId);

      request.onsuccess = () => {
        const existing =
          request.result as WordleLocalCheckpoint | undefined;

        // Only acknowledge the exact checkpoint that
        // was successfully saved to the server.
        // Never clear a newer unsynchronized checkpoint.
        if (
          existing &&
          existing.revision === revision
        ) {
          store.put({
            ...existing,
            pendingRemoteSync: false,
          });
        }
      };

      request.onerror = () => {
        transaction.abort();
      };

      transaction.oncomplete = () => resolve();

      transaction.onerror = () =>
        reject(
          transaction.error ??
            new Error('Unable to acknowledge Wordle checkpoint'),
        );

      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error('Wordle checkpoint acknowledgement aborted'),
        );
    });
  } finally {
    db.close();
  }
}
