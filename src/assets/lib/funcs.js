
/**
 * function that takes a key string like 'name' or 'name.first' and returns a function that takes an object and returns the value of the key in the object
 * @param key - the key to get the value of you cane dots for nesting values
 * @param obj - the object to get the value from
 */
export const getObjValue = (key, obj) => {
    const keys = key.toString().split('.');
    let result = obj;
    for (const key of keys) {
      if (result && Object.hasOwn(result, key)) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    return result;
  };