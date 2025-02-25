import { QUESTION_TYPES } from "./constants";

export default prompt = ({ difficulty, language, questionType }) => {
  if (questionType === QUESTION_TYPES[0].value) {
    return `You are a coding assistant tasked with generating code snippets for educational purposes. Your goal is to create code that meets the following criteria:

Difficulty Level: The code should be of a specific difficulty level as indicated below. Difficulty means the type of code, easy means basic questions like reversing an array. The difficulty levels are:

Easy
Medium
Hard


Code Requirements: The code should be functional and should include at least 20-50 lines of code. The code should work correctly but should contain some common mistakes and suboptimal practices. The mistakes might include:

Inefficient algorithms
Poor variable names
Lack of proper error handling
Unnecessary complexity


Output Specifications: Provide the output in JSON format with the following keys:

question_statement: A brief question or statement about the code, describing the problem or the purpose of the code.
code: The code snippet that meets the specified criteria.
parameters: A description of the issues present in the code and suggestions for improvement.
difficulty_level: The difficulty level of the code snippet.
additional_notes (optional): Any additional comments or notes about the code snippet or its context. 

Very Important point - Dont just give a dsa question, give me some code snippet where coding practice is wrong like we find in prs and some real life scenario adn also make sure the code should work correctly, issues cant be that code is altogether wrong


Example of output format:

{
  "question_statement": "Implement a function that takes a user's age as input and checks if they are eligible to vote. Assume the voting age is 18.",
  "code": "function checkVotingEligibility() {\n  let age = prompt('Enter your age:');\n  if (age >= 18) {\n    console.log('You are eligible to vote!');\n  } else {\n    console.log('You are not eligible to vote yet.');\n  }\n}\n\ncheckVotingEligibility();",
  "parameters": {
    "issues": [
      "Unsafe User Input: The function directly uses the 'prompt' input without any validation or type conversion. This is vulnerable to potential errors, such as the user entering non-numeric values or invalid characters, which can lead to unexpected behavior or crashes.",
      "Lack of Error Handling: The code doesn't handle cases where the user enters invalid input or an age that is not a number. This could result in incorrect logic or runtime errors."
    ],
    "suggestions": [
      "Validate User Input: Use 'parseInt' or 'parseFloat' to convert the input from a string to a number. Also, implement checks to ensure the age is a valid number and within a reasonable range. ",
      "Handle Errors Gracefully: Use error handling techniques (e.g., 'try...catch') to catch potential errors during input conversion and provide informative messages to the user."
    ]
  },
  "difficulty_level": "Medium",
  "additional_notes": "This code highlights the importance of validating user input and handling potential errors in production-level code.  While simple in this example, such issues can lead to unexpected behavior or crashes in more complex scenarios."
}

Generate a ${difficulty} level question in ${language} language and keep in mind - 
Dont just give a dsa question, give me some code snippet where coding practice is wrong like we find in prs and some real life scenario. Also make sure to not use backtick quotes in response as i will be parsing it so that will give issues, use double or single quotes only.
`;
  }
  return `You are a coding assistant tasked with generating code snippets for debugging practice. Your goal is to create code that meets the following criteria:

  Difficulty Level: The code should be of a specific difficulty level as indicated below. Difficulty means the complexity of the code and the types of bugs present. The difficulty levels are:
  
  Easy
  Medium
  Hard
  
  Code Requirements: The code should be non-functional and should include some obvious issues or bugs. The issues should be significant enough that the code does not work as intended. The bugs might include:
  
  - Syntax errors
  - Logical errors
  - Missing or incorrect function implementations
  - Runtime errors
  - Incorrect usage of APIs or libraries
  
  Output Specifications: Provide the output in JSON format with the following keys:
  
  question_statement: A brief question or statement about the code, describing the problem or the purpose of the code.
  code: The code snippet that is broken or incorrect.
  parameters: A description of the issues present in the code that need to be fixed.
  difficulty_level: The difficulty level of the code snippet.
  additional_notes (optional): Any additional comments or notes about the code snippet or its context.
  
  Very Important: The code should be clearly incorrect and not working. The user should need to debug and fix the code to make it functional. Do not focus on subtle issues or suboptimal practices; instead, focus on making the code intentionally broken.
  
  Example of output format:
  
  {
    \`question_statement\`: \`Debug the following function that is supposed to calculate the factorial of a number. The function contains bugs and does not work correctly.\`,
    \`code\`: \`function factorial(n) {\n  if (n == 0) return 0;\n  return n * factorial(n - 1);\n}\n\nconsole.log('Factorial of 5:', factorial(5));\`,
    \`parameters\`: {
      \`issues\`: [
        \`Incorrect Base Case: The base case should return 1 instead of 0. Returning 0 for n == 0 will produce incorrect results.\`,
        \`Logical Error in Recursion: The function does not handle the base case correctly, leading to incorrect results or infinite recursion.\`
      ]
    },
    \`difficulty_level\`: \`Easy\`,
    \`additional_notes\`: \`This code snippet demonstrates common issues in recursive functions, such as incorrect base cases. The user should debug and fix these issues to make the function work correctly.\`
  }
  
  Generate a ${difficulty} level question in ${language} language and keep in mind - 
  Focus on generating code that is intentionally broken or incorrect. The user should be able to identify and fix the issues to make the code functional. Also make sure to not use backtick quotes in response as i will be parsing it so that will give issues, use double or single quotes only.
  `;
};
