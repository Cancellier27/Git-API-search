import {testSum} from "./index"

test("sum 2 + 3 to be 5", () => {
  expect(testSum(2,3)).toBe(3)
})