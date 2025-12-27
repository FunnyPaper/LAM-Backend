import ms from "ms";

export function computeDate(time: ms.StringValue) {
  return new Date(Date.now() + ms(time));
}