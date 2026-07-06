export type Lang = "python" | "c" | "cpp" | "java";

export type TestCase = { stdin: string; expected: string; hidden?: boolean };

export type Explanation = {
  intuition: string;
  approach: string;
  walkthrough: string;
  complexity: string;
};

export type Problem = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  blurb: string;
  statement: string;
  starter: Record<Lang, string>;
  solution: Record<Lang, string>;
  tests: TestCase[];
  explanation: Explanation;
};

export const LANGUAGES: { key: Lang; label: string }[] = [
  { key: "python", label: "Python" },
  { key: "c", label: "C" },
  { key: "cpp", label: "C++" },
  { key: "java", label: "Java" },
];

export const problems: Problem[] = [
  {
    slug: "sum-two-numbers",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    topic: "warm-up",
    blurb: "Read two integers and print their sum. The classic first program.",
    statement:
      "Read two integers `a` and `b` from standard input (they may be on one line separated by a space, or on two lines) and print their sum.\n\nInput: two integers a and b.\nOutput: a single integer, a + b.",
    starter: {
      python: `a, b = map(int, input().split())\n# print their sum\n`,
      c: `#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    // print their sum\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // print their sum\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        // print their sum\n    }\n}\n`,
    },
    solution: {
      python: `a, b = map(int, input().split())\nprint(a + b)\n`,
      c: `#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}\n`,
    },
    tests: [
      { stdin: "2 3", expected: "5" },
      { stdin: "10 20", expected: "30" },
      { stdin: "-4 9", expected: "5", hidden: true },
      { stdin: "0 0", expected: "0", hidden: true },
    ],
    explanation: {
      intuition:
        "There's no algorithm here — the point is the input/output contract every later problem builds on: read from stdin, compute, print to stdout. Get comfortable with how your language reads numbers.",
      approach:
        "Read the two integers with your language's standard input reader, add them, and print the result followed by a newline.",
      walkthrough:
        "`split()` (Python) / `scanf`/`cin`/`Scanner` (C/C++/Java) tokenise the input into two integers regardless of whether they're on one line or two. Adding them is `a + b`. Printing adds the trailing newline the checker expects.",
      complexity: "O(1) time and O(1) space — a fixed amount of work no matter the input values.",
    },
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    topic: "loops & conditionals",
    blurb: "Print 1..n, but Fizz for multiples of 3, Buzz for 5, FizzBuzz for both.",
    statement:
      "Read an integer `n`. For each number from 1 to n, print on its own line:\n\n- `Fizz` if it's divisible by 3,\n- `Buzz` if it's divisible by 5,\n- `FizzBuzz` if it's divisible by both,\n- otherwise the number itself.",
    starter: {
      python: `n = int(input())\nfor i in range(1, n + 1):\n    # decide what to print\n    pass\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        // decide what to print\n    }\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    for (int i = 1; i <= n; i++) {\n        // decide what to print\n    }\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        for (int i = 1; i <= n; i++) {\n            // decide what to print\n        }\n    }\n}\n`,
    },
    solution: {
      python: `n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) printf("FizzBuzz\\n");\n        else if (i % 3 == 0) printf("Fizz\\n");\n        else if (i % 5 == 0) printf("Buzz\\n");\n        else printf("%d\\n", i);\n    }\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) cout << "FizzBuzz\\n";\n        else if (i % 3 == 0) cout << "Fizz\\n";\n        else if (i % 5 == 0) cout << "Buzz\\n";\n        else cout << i << "\\n";\n    }\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) System.out.println("FizzBuzz");\n            else if (i % 3 == 0) System.out.println("Fizz");\n            else if (i % 5 == 0) System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n}\n`,
    },
    tests: [
      { stdin: "5", expected: "1\n2\nFizz\n4\nBuzz" },
      { stdin: "15", expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { stdin: "3", expected: "1\n2\nFizz", hidden: true },
    ],
    explanation: {
      intuition:
        "The trap is checking 3 and 5 separately and missing the both-case. The clean fix is to test the most specific condition first: divisible by 15 (i.e. by both 3 and 5) before either alone.",
      approach:
        "Loop i from 1 to n. Check `i % 15 == 0` first, then `i % 3`, then `i % 5`, else print i. Order matters — the FizzBuzz check must come before Fizz and Buzz.",
      walkthrough:
        "Divisible by both 3 and 5 is the same as divisible by 15, so a single `i % 15 == 0` captures the FizzBuzz case. Because it's checked first, 15, 30, 45… never fall through to the Fizz-only or Buzz-only branches. Everything else prints the number.",
      complexity: "O(n) time — one pass from 1 to n — and O(1) extra space.",
    },
  },
  {
    slug: "max-of-array",
    title: "Maximum of an Array",
    difficulty: "Easy",
    topic: "arrays & iteration",
    blurb: "Read n numbers and print the largest — the pattern behind every 'find the best' problem.",
    statement:
      "The first line contains an integer `n`. The second line contains `n` space-separated integers. Print the maximum value.",
    starter: {
      python: `n = int(input())\nnums = list(map(int, input().split()))\n# find and print the maximum\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    int x, best;\n    // read n numbers, track the largest\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    // read n numbers, track the largest\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // read n numbers, track the largest\n    }\n}\n`,
    },
    solution: {
      python: `n = int(input())\nnums = list(map(int, input().split()))\nprint(max(nums))\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    int x, best = 0;\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &x);\n        if (i == 0 || x > best) best = x;\n    }\n    printf("%d\\n", best);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    int x, best = 0;\n    for (int i = 0; i < n; i++) {\n        cin >> x;\n        if (i == 0 || x > best) best = x;\n    }\n    cout << best << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int best = 0;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (i == 0 || x > best) best = x;\n        }\n        System.out.println(best);\n    }\n}\n`,
    },
    tests: [
      { stdin: "5\n3 7 2 9 4", expected: "9" },
      { stdin: "1\n42", expected: "42" },
      { stdin: "4\n-5 -2 -9 -1", expected: "-1", hidden: true },
      { stdin: "3\n10 10 10", expected: "10", hidden: true },
    ],
    explanation: {
      intuition:
        "Scanning for the biggest value is the template for every 'find the best' problem: hold a running champion, and challenge it against each new item. The only subtlety is where the champion starts.",
      approach:
        "Keep a variable `best`. Seed it with the first element (not 0 — negatives would break that), then for each remaining number, replace `best` when you see something larger.",
      walkthrough:
        "Initialising `best` to 0 is the classic bug: an all-negative array would wrongly report 0. Seeding with the first element (`i == 0 || x > best`) fixes it. Each comparison is O(1), and one pass visits every element once. Python's `max()` does exactly this under the hood.",
      complexity: "O(n) time — one comparison per element — and O(1) extra space beyond the input.",
    },
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    topic: "strings",
    blurb: "Read a word and print it backwards. Meet your language's string tools.",
    statement: "Read a single word (no spaces) from input and print it reversed.",
    starter: {
      python: `s = input()\n# print s reversed\n`,
      c: `#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1001];\n    scanf("%s", s);\n    // print the characters in reverse\n    return 0;\n}\n`,
      cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    // reverse and print\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).next();\n        // print s reversed\n    }\n}\n`,
    },
    solution: {
      python: `s = input()\nprint(s[::-1])\n`,
      c: `#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1001];\n    scanf("%s", s);\n    for (int i = strlen(s) - 1; i >= 0; i--) putchar(s[i]);\n    putchar('\\n');\n    return 0;\n}\n`,
      cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).next();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}\n`,
    },
    tests: [
      { stdin: "hello", expected: "olleh" },
      { stdin: "abc", expected: "cba" },
      { stdin: "racecar", expected: "racecar", hidden: true },
      { stdin: "a", expected: "a", hidden: true },
    ],
    explanation: {
      intuition: "Reversing is really just reading the characters from the last index down to the first. Every language gives you a shortcut, but they all do the same walk under the hood.",
      approach: "Read the word, then output its characters in reverse order — via a slice, a built-in reverse, or a manual loop from the end.",
      walkthrough: "Python's `s[::-1]` slices from end to start with step -1. C++ `reverse` swaps characters in place. Java's `StringBuilder.reverse()` does the same. The C version loops the index from `strlen(s)-1` down to 0 and prints each char.",
      complexity: "O(n) time for n characters, and O(n) space to hold the string (O(1) extra if you print char-by-char like the C version).",
    },
  },
  {
    slug: "count-vowels",
    title: "Count the Vowels",
    difficulty: "Easy",
    topic: "strings",
    blurb: "Count how many vowels are in a word — a first taste of scanning and counting.",
    statement: "Read a single lowercase word and print how many of its letters are vowels (a, e, i, o, u).",
    starter: {
      python: `s = input()\n# count vowels in s\n`,
      c: `#include <stdio.h>\nint main() {\n    char s[1001];\n    scanf("%s", s);\n    int count = 0;\n    // count the vowels\n    printf("%d\\n", count);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    int count = 0;\n    // count the vowels\n    cout << count << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).next();\n        int count = 0;\n        // count the vowels\n        System.out.println(count);\n    }\n}\n`,
    },
    solution: {
      python: `s = input()\nprint(sum(1 for c in s if c in "aeiou"))\n`,
      c: `#include <stdio.h>\nint main() {\n    char s[1001];\n    scanf("%s", s);\n    int count = 0;\n    for (int i = 0; s[i]; i++)\n        if (s[i]=='a'||s[i]=='e'||s[i]=='i'||s[i]=='o'||s[i]=='u') count++;\n    printf("%d\\n", count);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    int count = 0;\n    for (char c : s) if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') count++;\n    cout << count << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).next();\n        int count = 0;\n        for (char c : s.toCharArray()) if ("aeiou".indexOf(c) >= 0) count++;\n        System.out.println(count);\n    }\n}\n`,
    },
    tests: [
      { stdin: "hello", expected: "2" },
      { stdin: "sky", expected: "0" },
      { stdin: "education", expected: "5", hidden: true },
      { stdin: "aeiou", expected: "5", hidden: true },
    ],
    explanation: {
      intuition: "Counting matches is the bread-and-butter of string work: walk every character, and bump a counter whenever it's one you care about.",
      approach: "Start a counter at 0. For each character, check if it's one of a, e, i, o, u; if so, add one. Print the total.",
      walkthrough: "Each solution iterates the characters once. The check is a membership test — `c in \"aeiou\"` (Python), `\"aeiou\".indexOf(c) >= 0` (Java), or an explicit OR chain (C). The counter accumulates and is printed at the end.",
      complexity: "O(n) time for n characters and O(1) extra space — just the counter.",
    },
  },
  {
    slug: "factorial",
    title: "Factorial",
    difficulty: "Easy",
    topic: "loops & math",
    blurb: "Compute n! — your first look at how quickly numbers grow (and overflow).",
    statement: "Read an integer n (0 ≤ n ≤ 20) and print n! (the product 1×2×…×n). Note 0! = 1.",
    starter: {
      python: `n = int(input())\n# print n!\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    long long f = 1;\n    // multiply 1..n\n    printf("%lld\\n", f);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long f = 1;\n    // multiply 1..n\n    cout << f << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        long f = 1;\n        // multiply 1..n\n        System.out.println(f);\n    }\n}\n`,
    },
    solution: {
      python: `n = int(input())\nf = 1\nfor i in range(2, n + 1):\n    f *= i\nprint(f)\n`,
      c: `#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    long long f = 1;\n    for (int i = 2; i <= n; i++) f *= i;\n    printf("%lld\\n", f);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long f = 1;\n    for (int i = 2; i <= n; i++) f *= i;\n    cout << f << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        long f = 1;\n        for (int i = 2; i <= n; i++) f *= i;\n        System.out.println(f);\n    }\n}\n`,
    },
    tests: [
      { stdin: "5", expected: "120" },
      { stdin: "0", expected: "1" },
      { stdin: "10", expected: "3628800", hidden: true },
      { stdin: "1", expected: "1", hidden: true },
    ],
    explanation: {
      intuition: "A factorial is a running product: start at 1 and keep multiplying by the next number. The empty product (for 0!) is 1, which is why the loop starting at 2 handles 0 and 1 for free.",
      approach: "Initialise `f = 1`, loop i from 2 to n multiplying `f` by i each time, then print `f`.",
      walkthrough: "Seeding `f` at 1 means n = 0 and n = 1 both correctly print 1 (the loop body never runs or runs once with i beyond range). For larger n, `f` accumulates the product. Use a 64-bit type (`long`/`long long`) because factorials overflow a 32-bit int past 12!.",
      complexity: "O(n) time — one multiply per step — and O(1) space. Python integers are arbitrary-precision, so they never overflow; C/C++/Java need 64-bit and still overflow past 20!.",
    },
  },
  {
    slug: "nth-fibonacci",
    title: "Nth Fibonacci Number",
    difficulty: "Medium",
    topic: "recursion & memoization",
    blurb: "Compute the nth Fibonacci number with memoized recursion — see why caching turns exponential blowup into linear time.",
    statement:
      "Read an integer `n` (0 ≤ n ≤ 50). Using recursion with memoization (top-down dynamic programming), print the nth Fibonacci number, where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n ≥ 2.\n\nPlain recursion recomputes the same subproblems exponentially many times — naive fib(n) makes O(2^n) calls. Caching each result the first time it's computed brings that down to O(n).\n\nInput: a single integer n.\nOutput: F(n).",
    starter: {
      python: `n = int(input())\nmemo = {0: 0, 1: 1}\ndef fib(k):\n    if k in memo:\n        return memo[k]\n    # compute fib(k-1) + fib(k-2), store it in memo[k], then return it\nprint(fib(n))\n`,
      c: `#include <stdio.h>\nlong long memo[51];\nint computed[51];\nlong long fib(int k) {\n    if (k <= 1) return k;\n    if (computed[k]) return memo[k];\n    // compute fib(k-1) + fib(k-2), cache it in memo[k], mark computed[k], then return it\n    return 0;\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%lld\\n", fib(n));\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long memo[51];\nbool computed[51];\nlong long fib(int k) {\n    if (k <= 1) return k;\n    if (computed[k]) return memo[k];\n    // compute fib(k-1) + fib(k-2), cache it in memo[k], mark computed[k], then return it\n    return 0;\n}\nint main() {\n    int n; cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    static long[] memo = new long[51];\n    static boolean[] computed = new boolean[51];\n    static long fib(int k) {\n        if (k <= 1) return k;\n        if (computed[k]) return memo[k];\n        // compute fib(k-1) + fib(k-2), cache it in memo[k], mark computed[k], then return it\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        System.out.println(fib(n));\n    }\n}\n`,
    },
    solution: {
      python: `n = int(input())\nmemo = {0: 0, 1: 1}\ndef fib(k):\n    if k in memo:\n        return memo[k]\n    memo[k] = fib(k - 1) + fib(k - 2)\n    return memo[k]\nprint(fib(n))\n`,
      c: `#include <stdio.h>\nlong long memo[51];\nint computed[51];\nlong long fib(int k) {\n    if (k <= 1) return k;\n    if (computed[k]) return memo[k];\n    computed[k] = 1;\n    memo[k] = fib(k - 1) + fib(k - 2);\n    return memo[k];\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%lld\\n", fib(n));\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long memo[51];\nbool computed[51];\nlong long fib(int k) {\n    if (k <= 1) return k;\n    if (computed[k]) return memo[k];\n    computed[k] = true;\n    memo[k] = fib(k - 1) + fib(k - 2);\n    return memo[k];\n}\nint main() {\n    int n; cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    static long[] memo = new long[51];\n    static boolean[] computed = new boolean[51];\n    static long fib(int k) {\n        if (k <= 1) return k;\n        if (computed[k]) return memo[k];\n        computed[k] = true;\n        memo[k] = fib(k - 1) + fib(k - 2);\n        return memo[k];\n    }\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        System.out.println(fib(n));\n    }\n}\n`,
    },
    tests: [
      { stdin: "0", expected: "0" },
      { stdin: "1", expected: "1" },
      { stdin: "10", expected: "55" },
      { stdin: "20", expected: "6765", hidden: true },
      { stdin: "40", expected: "102334155", hidden: true },
      { stdin: "50", expected: "12586269025", hidden: true },
    ],
    explanation: {
      intuition:
        "Naive recursion for Fibonacci recomputes the same calls exponentially many times — fib(5) calls fib(3) twice, fib(2) three times, and so on. Caching (memoizing) each answer the first time it's computed turns that blow-up into linear work.",
      approach:
        "Keep a cache (an array or dict) from k to its Fibonacci value. Before recursing on k, check the cache; after computing a value, store it before returning.",
      walkthrough:
        "fib(k) for k ≤ 1 returns k directly — the base case. Otherwise, if the cache already has fib(k), return it immediately with no further recursion. Otherwise compute fib(k-1) + fib(k-2) (which may recurse further, but each distinct k is ever computed once thanks to the cache), store it, and return it. Without memoization this branches into two calls per level, giving O(2^n) total calls; with it, each of the n distinct subproblems is solved exactly once.",
      complexity:
        "O(n) time and O(n) space with memoization, versus O(2^n) time for naive recursion without a cache. Fibonacci values exceed 32-bit range around n≈47, hence the 64-bit type (long long/long); Python's integers are arbitrary-precision.",
    },
  },
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Medium",
    topic: "arrays & searching",
    blurb: "Find the pair of numbers in an array that add up to a target — the classic first 'search a structure' problem.",
    statement:
      "The first line contains an integer `n` (1 ≤ n ≤ 1000). The second line contains `n` space-separated integers — the array. The third line contains an integer `target`.\n\nFind two elements of the array, at different positions, whose sum equals `target`. Check pairs `(i, j)` with `i < j` in order of increasing `i` and then increasing `j`, and print the first matching pair's values (`arr[i]` then `arr[j]`), separated by a space. It is guaranteed at least one such pair exists.\n\nInput: n, then n integers, then target.\nOutput: the two numbers that sum to target, space-separated.",
    starter: {
      python: `n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n# find i < j with arr[i] + arr[j] == target and print arr[i] arr[j]\n`,
      c: `#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[1000];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int target;\n    scanf("%d", &target);\n    // find i < j with arr[i] + arr[j] == target and print arr[i] arr[j]\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    // find i < j with arr[i] + arr[j] == target and print arr[i] arr[j]\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // find i < j with arr[i] + arr[j] == target and print arr[i] arr[j]\n    }\n}\n`,
    },
    solution: {
      python: `n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\nfound = False\nfor i in range(n):\n    if found:\n        break\n    for j in range(i + 1, n):\n        if arr[i] + arr[j] == target:\n            print(arr[i], arr[j])\n            found = True\n            break\n`,
      c: `#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[1000];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int target;\n    scanf("%d", &target);\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] + arr[j] == target) {\n                printf("%d %d\\n", arr[i], arr[j]);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] + arr[j] == target) {\n                cout << arr[i] << " " << arr[j] << endl;\n                return 0;\n            }\n        }\n    }\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] + arr[j] == target) {\n                    System.out.println(arr[i] + " " + arr[j]);\n                    return;\n                }\n            }\n        }\n    }\n}\n`,
    },
    tests: [
      { stdin: "4\n2 7 11 15\n9", expected: "2 7" },
      { stdin: "3\n3 2 4\n6", expected: "2 4" },
      { stdin: "4\n3 3 4 2\n6", expected: "3 3" },
      { stdin: "2\n1 2\n3", expected: "1 2", hidden: true },
      { stdin: "4\n-3 4 3 90\n0", expected: "-3 3", hidden: true },
      { stdin: "6\n10 20 10 40 5 25\n15", expected: "10 5", hidden: true },
    ],
    explanation: {
      intuition:
        "The brute-force way to find a pair summing to a target is to just try every pair — for arrays of this size that's plenty fast, and it's the same algorithm no matter which language you write it in.",
      approach:
        "Two nested loops: the outer index i runs from 0 to n-1, the inner index j from i+1 to n-1. The moment arr[i] + arr[j] equals target, print them and stop — the first (i, j) found in that scan order is the answer.",
      walkthrough:
        "Fixing i and sweeping j past it checks every unordered pair exactly once without repeats (j is always > i). Breaking out immediately on a match — a flag in Python, `return`/`return 0` in C/C++/Java — guarantees the pair reported is the one found first by increasing i, then increasing j, so duplicate values and multiple valid pairs still resolve deterministically.",
      complexity:
        "O(n^2) time in the worst case (checking almost every pair) and O(n) space for the array. A hash-map pass could do this in O(n) time instead, but the nested loop is the natural starting point and is what's implemented here.",
    },
  },
  {
    slug: "coin-change",
    title: "Coin Change (Minimum Coins)",
    difficulty: "Hard",
    topic: "dynamic programming",
    blurb: "Make a target amount with the fewest coins — the textbook dynamic programming problem.",
    statement:
      "The first line contains an integer `m` (1 ≤ m ≤ 20) — the number of coin denominations. The second line contains `m` space-separated positive integers — the coin values. The third line contains an integer `amount` (0 ≤ amount ≤ 1000).\n\nUsing unlimited copies of the given coins, print the fewest coins needed to make exactly `amount`, or `-1` if it can't be made exactly.\n\nInput: m, then m coin values, then amount.\nOutput: the minimum number of coins, or -1.",
    starter: {
      python: `m = int(input())\ncoins = list(map(int, input().split()))\namount = int(input())\n# build dp so dp[a] = fewest coins to make amount a, or -1 if impossible\n`,
      c: `#include <stdio.h>\n#define MAXA 1000\nint main() {\n    int m;\n    scanf("%d", &m);\n    int coins[20];\n    for (int i = 0; i < m; i++) scanf("%d", &coins[i]);\n    int amount;\n    scanf("%d", &amount);\n    int dp[MAXA + 1];\n    // build dp so dp[a] = fewest coins to make amount a, or -1 if impossible\n    // then print dp[amount]\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nconst int MAXA = 1000;\nint main() {\n    int m; cin >> m;\n    int coins[20];\n    for (int i = 0; i < m; i++) cin >> coins[i];\n    int amount; cin >> amount;\n    static int dp[MAXA + 1];\n    // build dp so dp[a] = fewest coins to make amount a, or -1 if impossible\n    // then print dp[amount]\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n        int[] coins = new int[m];\n        for (int i = 0; i < m; i++) coins[i] = sc.nextInt();\n        int amount = sc.nextInt();\n        int[] dp = new int[amount + 1];\n        // build dp so dp[a] = fewest coins to make amount a, or -1 if impossible\n        // then print dp[amount]\n    }\n}\n`,
    },
    solution: {
      python: `m = int(input())\ncoins = list(map(int, input().split()))\namount = int(input())\nINF = float('inf')\ndp = [0] + [INF] * amount\nfor a in range(1, amount + 1):\n    for c in coins:\n        if c <= a and dp[a - c] + 1 < dp[a]:\n            dp[a] = dp[a - c] + 1\nprint(dp[amount] if dp[amount] != INF else -1)\n`,
      c: `#include <stdio.h>\n#define MAXA 1000\nint main() {\n    int m;\n    scanf("%d", &m);\n    int coins[20];\n    for (int i = 0; i < m; i++) scanf("%d", &coins[i]);\n    int amount;\n    scanf("%d", &amount);\n    int dp[MAXA + 1];\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++) {\n        dp[a] = -1;\n        for (int i = 0; i < m; i++) {\n            int c = coins[i];\n            if (c <= a && dp[a - c] != -1) {\n                if (dp[a] == -1 || dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;\n            }\n        }\n    }\n    printf("%d\\n", dp[amount]);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nconst int MAXA = 1000;\nint main() {\n    int m; cin >> m;\n    int coins[20];\n    for (int i = 0; i < m; i++) cin >> coins[i];\n    int amount; cin >> amount;\n    static int dp[MAXA + 1];\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++) {\n        dp[a] = -1;\n        for (int i = 0; i < m; i++) {\n            int c = coins[i];\n            if (c <= a && dp[a - c] != -1) {\n                if (dp[a] == -1 || dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;\n            }\n        }\n    }\n    cout << dp[amount] << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n        int[] coins = new int[m];\n        for (int i = 0; i < m; i++) coins[i] = sc.nextInt();\n        int amount = sc.nextInt();\n        int[] dp = new int[amount + 1];\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            dp[a] = -1;\n            for (int c : coins) {\n                if (c <= a && dp[a - c] != -1) {\n                    if (dp[a] == -1 || dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;\n                }\n            }\n        }\n        System.out.println(dp[amount]);\n    }\n}\n`,
    },
    tests: [
      { stdin: "3\n1 2 5\n11", expected: "3" },
      { stdin: "1\n2\n3", expected: "-1" },
      { stdin: "3\n1 3 4\n6", expected: "2" },
      { stdin: "1\n1\n0", expected: "0", hidden: true },
      { stdin: "4\n1 2 5 10\n27", expected: "4", hidden: true },
      { stdin: "2\n2 4\n7", expected: "-1", hidden: true },
    ],
    explanation: {
      intuition:
        "Greedily always taking the biggest coin fails for arbitrary denominations. The safe approach is dynamic programming: solve every amount from 0 up to the target, reusing smaller answers you've already worked out.",
      approach:
        "Let dp[a] be the fewest coins needed to make amount a, with dp[0] = 0. For each amount a from 1 to the target, try every coin c ≤ a: if dp[a-c] is reachable, dp[a] can be dp[a-c] + 1. Keep the best option across all coins.",
      walkthrough:
        "dp[0] = 0 is the base case — zero coins make amount zero. Every other dp[a] starts as unreachable (-1) and gets updated whenever some coin c lets you reach it from an already-solved smaller amount a-c. Because amounts are processed in increasing order, dp[a-c] is always already finalized by the time dp[a] needs it. If dp[amount] is never updated, that amount can't be formed exactly and the answer is -1.",
      complexity:
        "O(amount × m) time, where m is the number of coin denominations, and O(amount) space for the dp array — versus exponential time for trying every combination of coins by brute-force backtracking.",
    },
  },
  {
    slug: "connected-regions",
    title: "Connected Regions in a Grid",
    difficulty: "Hard",
    topic: "graphs & grids",
    blurb: "Count the blobs of connected 1s in a grid — the classic flood-fill / graph traversal problem.",
    statement:
      "The first line contains two integers `r` and `c` (1 ≤ r, c ≤ 20) — the grid's rows and columns. Each of the next `r` lines contains a string of `c` characters, each `0` or `1`.\n\nTwo `1` cells belong to the same region if you can walk between them moving only up, down, left, or right through other `1` cells (no diagonals). Print the number of separate regions of connected `1`s.\n\nInput: r and c, then r rows of the grid.\nOutput: a single integer, the number of connected regions.",
    starter: {
      python: `r, c = map(int, input().split())\ngrid = [input() for _ in range(r)]\n# count connected regions of '1's (4-directional) using BFS or DFS\n`,
      c: `#include <stdio.h>\n#define MAXN 20\nchar grid[MAXN][MAXN + 1];\nint visited[MAXN][MAXN];\nint main() {\n    int R, C;\n    scanf("%d %d", &R, &C);\n    for (int i = 0; i < R; i++) scanf("%s", grid[i]);\n    // count connected regions of '1's (4-directional) using an explicit stack or queue\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nconst int MAXN = 20;\nchar grid[MAXN][MAXN + 1];\nbool visited[MAXN][MAXN];\nint main() {\n    int R, C;\n    cin >> R >> C;\n    for (int i = 0; i < R; i++) cin >> grid[i];\n    // count connected regions of '1's (4-directional) using an explicit stack or queue\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int R = sc.nextInt(), C = sc.nextInt();\n        String[] grid = new String[R];\n        for (int i = 0; i < R; i++) grid[i] = sc.next();\n        // count connected regions of '1's (4-directional) using an explicit stack or queue\n    }\n}\n`,
    },
    solution: {
      python: `r, c = map(int, input().split())\ngrid = [input() for _ in range(r)]\nvisited = [[False] * c for _ in range(r)]\ncount = 0\nfor i in range(r):\n    for j in range(c):\n        if grid[i][j] == '1' and not visited[i][j]:\n            count += 1\n            stack = [(i, j)]\n            visited[i][j] = True\n            while stack:\n                x, y = stack.pop()\n                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                    nx, ny = x + dx, y + dy\n                    if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == '1' and not visited[nx][ny]:\n                        visited[nx][ny] = True\n                        stack.append((nx, ny))\nprint(count)\n`,
      c: `#include <stdio.h>\n#define MAXN 20\nchar grid[MAXN][MAXN + 1];\nint visited[MAXN][MAXN];\nint main() {\n    int R, C;\n    scanf("%d %d", &R, &C);\n    for (int i = 0; i < R; i++) scanf("%s", grid[i]);\n    int count = 0;\n    int stackX[MAXN * MAXN], stackY[MAXN * MAXN];\n    int dx[4] = {1, -1, 0, 0};\n    int dy[4] = {0, 0, 1, -1};\n    for (int i = 0; i < R; i++) {\n        for (int j = 0; j < C; j++) {\n            if (grid[i][j] == '1' && !visited[i][j]) {\n                count++;\n                int top = 0;\n                stackX[top] = i; stackY[top] = j; top++;\n                visited[i][j] = 1;\n                while (top > 0) {\n                    top--;\n                    int x = stackX[top], y = stackY[top];\n                    for (int d = 0; d < 4; d++) {\n                        int nx = x + dx[d], ny = y + dy[d];\n                        if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == '1' && !visited[nx][ny]) {\n                            visited[nx][ny] = 1;\n                            stackX[top] = nx; stackY[top] = ny; top++;\n                        }\n                    }\n                }\n            }\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\nconst int MAXN = 20;\nchar grid[MAXN][MAXN + 1];\nbool visited[MAXN][MAXN];\nint main() {\n    int R, C;\n    cin >> R >> C;\n    for (int i = 0; i < R; i++) cin >> grid[i];\n    int count = 0;\n    int stackX[MAXN * MAXN], stackY[MAXN * MAXN];\n    int dx[4] = {1, -1, 0, 0};\n    int dy[4] = {0, 0, 1, -1};\n    for (int i = 0; i < R; i++) {\n        for (int j = 0; j < C; j++) {\n            if (grid[i][j] == '1' && !visited[i][j]) {\n                count++;\n                int top = 0;\n                stackX[top] = i; stackY[top] = j; top++;\n                visited[i][j] = true;\n                while (top > 0) {\n                    top--;\n                    int x = stackX[top], y = stackY[top];\n                    for (int d = 0; d < 4; d++) {\n                        int nx = x + dx[d], ny = y + dy[d];\n                        if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx][ny] == '1' && !visited[nx][ny]) {\n                            visited[nx][ny] = true;\n                            stackX[top] = nx; stackY[top] = ny; top++;\n                        }\n                    }\n                }\n            }\n        }\n    }\n    cout << count << endl;\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int R = sc.nextInt(), C = sc.nextInt();\n        String[] grid = new String[R];\n        for (int i = 0; i < R; i++) grid[i] = sc.next();\n        boolean[][] visited = new boolean[R][C];\n        int[] dx = {1, -1, 0, 0};\n        int[] dy = {0, 0, 1, -1};\n        int count = 0;\n        int[] stackX = new int[R * C];\n        int[] stackY = new int[R * C];\n        for (int i = 0; i < R; i++) {\n            for (int j = 0; j < C; j++) {\n                if (grid[i].charAt(j) == '1' && !visited[i][j]) {\n                    count++;\n                    int top = 0;\n                    stackX[top] = i; stackY[top] = j; top++;\n                    visited[i][j] = true;\n                    while (top > 0) {\n                        top--;\n                        int x = stackX[top], y = stackY[top];\n                        for (int d = 0; d < 4; d++) {\n                            int nx = x + dx[d], ny = y + dy[d];\n                            if (nx >= 0 && nx < R && ny >= 0 && ny < C && grid[nx].charAt(ny) == '1' && !visited[nx][ny]) {\n                                visited[nx][ny] = true;\n                                stackX[top] = nx; stackY[top] = ny; top++;\n                            }\n                        }\n                    }\n                }\n            }\n        }\n        System.out.println(count);\n    }\n}\n`,
    },
    tests: [
      { stdin: "3 3\n110\n110\n001", expected: "2" },
      { stdin: "4 4\n1100\n1100\n0010\n0011", expected: "2" },
      { stdin: "2 2\n00\n00", expected: "0" },
      { stdin: "1 5\n10101", expected: "3", hidden: true },
      { stdin: "3 3\n111\n111\n111", expected: "1", hidden: true },
      { stdin: "4 4\n1010\n0101\n1010\n0101", expected: "8", hidden: true },
    ],
    explanation: {
      intuition:
        "A 'region' is a blob of connected 1s. Once you find an unvisited 1, every 1 reachable from it by moving up, down, left, or right belongs to the same region — flood-fill it, mark it visited, count one region, and move on.",
      approach:
        "Scan every cell in reading order. Whenever a `1` hasn't been visited yet, that's a brand-new region: increment the count, then explore outward from it (DFS via an explicit stack, or BFS via an explicit queue) marking every connected `1` as visited so it's never counted again.",
      walkthrough:
        "The explicit stack (built from two plain arrays, since no dynamic structures are needed for a grid this small) holds cells still to explore. Popping a cell and pushing its unvisited `1` neighbours is exactly depth-first search. Because a cell is marked visited the moment it's pushed, it's never pushed twice, so each of the r×c cells is pushed and popped at most once.",
      complexity:
        "O(r × c) time and O(r × c) space (for the visited grid and the stack), since every cell is visited once and each visit does O(1) work checking its 4 neighbours.",
    },
  },
];

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}
