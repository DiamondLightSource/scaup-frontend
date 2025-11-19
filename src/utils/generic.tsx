export const genUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export interface JsonRefMap {
  /** Pointer path to parent resource */
  parent: string;
  /** Key/pointer map. Takes a key as a key, and a pointer to a value present in the declared parent's items */
  map: Record<string, string>;
}

export interface JsonRef {
  /** Reference, either in the form of a map or a path formatted as `#/parent/child` */
  $ref: JsonRefMap | string;
  /** Base values to include in returned array */
  base?: { [x: string]: any }[];
}

/**
 * Process passed pointer and extract values from pointee object.
 *
 * @param pointer Pointer whose references will be resolved
 * @param pointee Object to reference against
 * @returns Reference value (if valid), null (if valid but reference is not of right
 * type/empty) or original pointer
 */
export const parseJsonReferences = (pointer: string | JsonRef, pointee: Record<string, any>) => {
  if (typeof pointer === "object" && pointer.$ref !== undefined) {
    // TODO: test if pointer returns value rather than reference if syntax is not correct
    const ref: JsonRefMap | string = pointer.$ref;
    const baseArray = Array.isArray(pointer.base) ? structuredClone(pointer.base) : null;
    let pointerVal = parsePointer(
      typeof ref === "object" ? ref.parent.slice(2) : ref.slice(2),
      pointee,
    );

    if (!Array.isArray(pointerVal)) {
      return baseArray ?? pointerVal;
    }

    if (typeof ref === "object") {
      pointerVal = parseArrayUsingMap(ref.map, pointerVal);
    }

    const fullValue = baseArray ? baseArray.concat(pointerVal) : pointerVal;

    return fullValue.length < 1 ? null : fullValue;
  }
  return pointer;
};

/**
 * Extract reference from passed path from `obj`
 *
 * @param path Path to reference
 * @param obj Original object
 * @returns Contents of `obj` at the reference passed in `path`
 */
export const parsePointer = (path: string, obj: Record<string, any>): any =>
  path.split("/").reduce((p, c) => (p && p[c]) || null, obj);

/**
 * Take value mapping and apply it to an array of objects, extracting objects according to the map.
 *
 * Example: `{name: "fullName", dewarCode: "dCode"}` applied to `[{fullName: "Niki", dCode: "MX-1111-11"}]`
 * would return `[{name: "Niki", dewarCode: "MX-1111-11"}]`
 *
 * @param valueMap Value mapping to apply to array
 * @param arr Data array
 * @returns Processed object array matching the schema in `valueMap`
 */
export const parseArrayUsingMap = (valueMap: Record<string, string>, arr: Record<string, any>[]) =>
  arr.map((item) =>
    Object.fromEntries(Object.entries(valueMap).map(([key, value]) => [key, item[value]])),
  );

const calcAngleByIndex = (i: number, len: number) => ((2 * Math.PI) / len) * i + (3 / 2) * Math.PI;

/**
 * Calculate angular spacing between items, multiply by item index to obtain position
 * in circumference of circle, use sine/cosine to get cartesian coordinates.
 * Multiply by radius of inner circle, then apply offset to centre (radius +
 * half of button's width (20px) + margin (5px)) of outer circle
 *
 * @param i Index of point in circumference
 * @param len Total number of points in circumference
 * @param radius Radius of circle (in pixels)
 * @param sine Use sine to calculate position
 * @returns X/Y position of point in pixels
 */
export const calcCircumferencePos = (
  i: number,
  len: number,
  radius: number,
  sine: boolean = true,
) => (sine ? Math.sin : Math.cos)(calcAngleByIndex(i, len)) * radius + (radius + 20);

/**
 * Convert pascal case string to space separated, title-capitalised string
 *
 * @param input Input string
 * @returns Title-capitalised string
 */
export const pascalToSpace = (input: string) =>
  input.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

export const nameValidation = {
  pattern: {
    value: /^[a-zA-Z0-9_]*$/,
    message: "Name must only contain alphanumeric characters and underscores",
  },
};

/**
 * Check if all keys in a dictionary have empty arrays in them
 *
 * @param data Original data
 * @returns Whether at least one key has a non-empty array as its value
 */
export const allItemsEmptyInDict = (data: Record<string, any[]> | null) =>
  data !== null && Object.values(data).some((v) => v.length > 0);

/**
 * Parse network error response and display relevant error message
 * @param response Response to parse (JSON body)
 * @returns Returned error message, or default 'internal server error' message
 */
export const parseNetworkError = (response?: Record<string, any>) => {
  let details = "Internal server error";
  if (typeof response?.detail === "string") {
    details = response.detail;
  } else if (Array.isArray(response?.detail)) {
    details = (response?.detail as Array<any>).reduce(
      (acc: string, current) => acc.concat(current.msg),
      "",
    );
  }
  return details;
};

/**
 * Take ISO6801 date and format it into a human readable format
 * @param dateString Original date string
 * @returns Human readable date string
 */
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return "?" 
  }
  return new Date(dateString).toLocaleString("en-GB");
};
