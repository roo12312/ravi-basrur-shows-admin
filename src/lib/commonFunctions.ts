type JsonObject = { [key: string]: any };

export function filterNullKeys(obj: JsonObject): JsonObject {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );
}
