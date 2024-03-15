export default {
  /**
   * Returns a random number between min and max (inclusive)
   * @example
   * ```ts
   * randomRange(1, 5);
   * => // 3
   *
   * randomRange(1, 10, true);
   * => // 3.845013878893512
   * ```
   */
  randomRange: (min: number, max: number, allowFloat: boolean = false) => {
    const randomValue = Math.random() * (max - min + 1) + min;
    return allowFloat ? randomValue : Math.floor(randomValue);
  },
  /**
   * Returns a random element from an array
   * @example
   * ```ts
   * randomArray([1, 2, 3, 4, 5]);
   * => // 2
   *
   * randomArray(["a", "b", "c", "d", "e"]);
   * => // "d"
   *
   * randomArray([{ a: 1 }, { b: 2 }, { c: 3 }]);
   * => // {c: 3}
   * ```
   */
  randomArray: (arr: unknown[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  /**
   * Returns a random boolean
   * @example
   * ```ts
   * randomBoolean();
   * => // true
   * ```
   */
  randomBoolean: () => {
    return Math.random() < 0.5;
  },
  /**
   * Returns the average of an array of numbers
   * @example
   * ```ts
   * averageArray([1, 2, 3, 4, 5, 6]);
   * => // 3.5
   * ```
   */
  averageArray: (arr: number[]) => {
    return arr.reduce((a, b) => {
      return a + b;
    }, 0) / arr.length;
  },
  /**
   * Returns the factorial of a number
   * @example
   * ```ts
   * factorial(5);
   * => // 120
   * ```
   */
  factorial: (n: number) => {
    return n == 0 ? 1 : n * module.exports.factorial(n - 1);
  },
  /**
   * Returns a percentage value with a certain amount of decimal places
   * @example
   * ```ts
   * percentage(3, 28);
   * => // 11
   *
   * percentage(3, 28, 2);
   * => // 10.71
   * ```
   */
  percentage: (n: number, total: number, precision = 0) => {
    return (n / total * 100 || 0).toFixed(precision);
  },
  /**
   * Checks if a number is even
   * @example
   * ```ts
   * isEven(2);
   * => // true
   *
   * isEven(3);
   * => // false
   * ```
   */
  isEven: (n: number) => {
    return n % 2 == 0;
  },
  /**
   * Checks if a number is odd
   * @example
   * ```ts
   * isOdd(2);
   * => // false
   *
   * isOdd(3);
   * => // true
   * ```
   */
  isOdd: (n: number) => {
    return Math.abs(n % 2) == 1;
  }
};
