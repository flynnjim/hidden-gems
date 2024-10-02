const gems = require("../db/data/test-data/gems.js");
const { convertTimestampToDate, checkDateExists } = require("../db/seeds/utils.js");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { date: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts date: timestamp property to a date", () => {
    const timestamp = 1557572706232;
    const input = { date: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.date).toBeDate();
    expect(result.date).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { date: timestamp };
    convertTimestampToDate(input);
    const control = { date: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores any other key-value-pairs that are not a date in returned object", () => {
    const input = { date: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no date property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});
describe("checkDateExists", () => {
  test("returns true if date exists", () => {
    return checkDateExists("2023-10-05T07:00:00.000Z").then((result) => {
      expect(result).toBe(true)
    })
  })
  test("returns false if date does not exist", () => {
    return checkDateExists("1999-10-05T07:00:00.000Z").then()
    .catch((err) => {
      expect(err).toEqual({status: 404, message: "Not found"})
    })
  })
})