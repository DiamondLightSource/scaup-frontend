export const genUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const findValueByPath = (path: string, obj: Record<string, any>) =>
  path.split(".").reduce((p, c) => (p && p[c]) || null, obj);
