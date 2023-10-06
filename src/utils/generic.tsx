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

    if (typeof ref === "object") {
      const value = parsePointer(ref.parent.slice(2), pointee);
      return !Array.isArray(value) || value.length < 1 ? null : parseArrayUsingMap(ref.map, value);
    }

    return parsePointer(ref.slice(2), pointee);
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
