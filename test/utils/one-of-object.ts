import { faker } from "@faker-js/faker"

/**
 * Helper type used for {@link oneOfObject} function.
 */
export type OneOfObject<T> = { 
  [K in keyof T]: (
    | T[K] 
    | T[K][]
    | (() => T[K]) 
    | (() => T[K][])
    | (() => PromiseLike<T[K]>) 
    | (() => PromiseLike<T[K][]>)
  ) 
}

/**
 * Given source object, creates object with the same source type.
 * @param obj Object describing generation schema. Depending on the value assigned to the field
 * different strategies will be used to get the final value:
 *  * Singule value - no generation magic happens, use at it was given
 *  * Array - picks one value randomly (treats the array as options).
 *  * Function returning value - called for each element, result assigned to the field (useful for random values).
 *  * Function returning array - combination of the previous two, picks randomly one value from a function that is called for each field  .
 * @returns Object of the same shape as generic type T.
 */
export async function oneOfObject<T extends object>(obj: OneOfObject<T>): Promise<T> {
  return Object.fromEntries(
    await Promise.all(Object.keys(obj).map(async key => {
      let options: unknown[];

      if(obj[key] instanceof Function) {
        const res = await obj[key]()
        options = res instanceof Array ? res : [res]
      } else {
        options = obj[key] instanceof Array ? obj[key] : [obj[key]];
      }

      return [
        key, 
        faker.helpers.arrayElement(options)
      ]
    }))
  ) as T
}