export interface MockStore {
  users: any[];
  sessions: any[];
  patientProfiles: any[];
  medicalDetails: any[];
  healthLogs: any[];
  qrAccessTokens: any[];
  qrAccessLogs: any[];
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function flattenChunks(obj: any): any[] {
  if (!obj) return [];
  if (obj.queryChunks) {
    return obj.queryChunks.flatMap(flattenChunks);
  }
  return [obj];
}

/**
 * Checks if a mock DB record matches a Drizzle condition AST
 */
function evaluateCondition(item: any, condition: any): boolean {
  if (!condition) return true;

  const chunks = flattenChunks(condition);

  // Look for column, operator, param patterns
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Check if chunk is a Column (has name property)
    if (chunk && typeof chunk === 'object' && typeof chunk.name === 'string') {
      const colName = chunk.name;
      const camelName = snakeToCamel(colName);
      const valInItem = item[camelName] !== undefined ? item[camelName] : item[colName];

      const nextChunk = chunks[i + 1];
      const opStr = Array.isArray(nextChunk?.value) ? nextChunk.value.join('') : String(nextChunk?.value || '');

      if (opStr.includes('is null')) {
        if (valInItem !== null && valInItem !== undefined) {
          return false;
        }
      } else if (opStr.includes('=')) {
        const paramChunk = chunks[i + 2];
        const expectedVal = paramChunk?.value !== undefined ? paramChunk.value : paramChunk;
        if (valInItem !== expectedVal) {
          return false;
        }
      } else if (opStr.includes('>')) {
        const paramChunk = chunks[i + 2];
        const expectedVal = paramChunk?.value !== undefined ? paramChunk.value : paramChunk;
        if (valInItem <= expectedVal) {
          return false;
        }
      }
    }
  }

  return true;
}

export function createMockDb() {
  const store: MockStore = {
    users: [],
    sessions: [],
    patientProfiles: [],
    medicalDetails: [],
    healthLogs: [],
    qrAccessTokens: [],
    qrAccessLogs: [],
  };

  function getTableArray(table: any): any[] {
    const tableName = table?.[Symbol.for('drizzle:Name')] || table?._?.name || '';
    if (tableName === 'users') return store.users;
    if (tableName === 'sessions') return store.sessions;
    if (tableName === 'patient_profiles') return store.patientProfiles;
    if (tableName === 'medical_details') return store.medicalDetails;
    if (tableName === 'health_logs') return store.healthLogs;
    if (tableName === 'qr_access_tokens') return store.qrAccessTokens;
    if (tableName === 'qr_access_logs') return store.qrAccessLogs;
    return store.users;
  }

  const mockDb: any = {
    _store: store,
    reset() {
      store.users = [];
      store.sessions = [];
      store.patientProfiles = [];
      store.medicalDetails = [];
      store.healthLogs = [];
      store.qrAccessTokens = [];
      store.qrAccessLogs = [];
    },
    transaction: async (cb: (tx: any) => Promise<any>) => {
      return cb(mockDb);
    },
    select: (fields?: any) => {
      let targetTable: any = null;
      let limitVal: number | null = null;
      let offsetVal = 0;
      let isCount = false;
      let currentCondition: any = null;

      if (fields && fields.count) {
        isCount = true;
      }

      const chain: any = {
        from: (table: any) => {
          targetTable = table;
          return chain;
        },
        leftJoin: (_joinTable: any, _condition: any) => {
          return chain;
        },
        where: (condition: any) => {
          currentCondition = condition;
          return chain;
        },
        orderBy: () => chain,
        limit: (l: number) => {
          limitVal = l;
          return chain;
        },
        offset: (o: number) => {
          offsetVal = o;
          return chain;
        },
        then: (resolve: any, reject: any) => {
          try {
            const arr = getTableArray(targetTable);
            let results = arr.filter((item) => evaluateCondition(item, currentCondition));

            if (isCount) {
              const count = results.length;
              return resolve([{ count }]);
            }

            if (offsetVal > 0) {
              results = results.slice(offsetVal);
            }
            if (limitVal !== null) {
              results = results.slice(0, limitVal);
            }

            // If projection fields are requested, map them
            if (fields && typeof fields === 'object') {
              results = results.map((item) => {
                const mapped: any = {};
                for (const k of Object.keys(fields)) {
                  if (k === 'log') {
                    mapped.log = item;
                  } else {
                    mapped[k] = item[k] !== undefined ? item[k] : null;
                  }
                }
                return mapped;
              });
            }

            return resolve(results);
          } catch (e) {
            return reject(e);
          }
        },
      };

      return chain;
    },
    insert: (table: any) => {
      const arr = getTableArray(table);
      let valuesToInsert: any[] = [];

      const chain: any = {
        values: (val: any) => {
          valuesToInsert = Array.isArray(val) ? val : [val];
          return chain;
        },
        returning: async () => {
          const inserted = valuesToInsert.map((v) => {
            const id = v.id || `mock-id-${Math.random().toString(36).substring(2, 9)}`;
            const record = {
              id,
              ...v,
              createdAt: v.createdAt || new Date(),
              updatedAt: v.updatedAt || new Date(),
            };
            arr.push(record);
            return record;
          });
          return inserted;
        },
        then: async (resolve: any) => {
          const inserted = await chain.returning();
          return resolve(inserted);
        },
      };

      return chain;
    },
    update: (table: any) => {
      const arr = getTableArray(table);
      let setValues: any = {};
      let updateCondition: any = null;

      const chain: any = {
        set: (vals: any) => {
          setValues = vals;
          return chain;
        },
        where: (condition: any) => {
          updateCondition = condition;
          return chain;
        },
        returning: async () => {
          const updated: any[] = [];
          for (const item of arr) {
            if (evaluateCondition(item, updateCondition)) {
              Object.assign(item, setValues);
              updated.push(item);
            }
          }
          return updated;
        },
        then: async (resolve: any) => {
          const res = await chain.returning();
          return resolve(res);
        },
      };

      return chain;
    },
  };

  return mockDb;
}
