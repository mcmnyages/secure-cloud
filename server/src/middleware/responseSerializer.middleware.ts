import { createSerializer } from "../http/createSerializer.js";

export function responseSerializer(req: any, res: any, next: any) {
  const serializer = createSerializer(req);

  const originalJson = res.json;

  res.json = function (data: any) {
    const transformed = serializer.transform(data);
    return originalJson.call(this, transformed);
  };

  next();
}