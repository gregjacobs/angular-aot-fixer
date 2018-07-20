# angular-aot-fixer

Utility to assist in fixing AOT compatibility issues in an Angular codebase.

Currently this utility only does one transformation: turns `private` 
properties/methods which are accessed by an `.html` template into `public`
properties/methods.

For example, the following component:

```
@Component( {
    selector: 'my-component',
    template: `
        Hello, {{ worldText }}!
    `
} )
export class MyComponent {
    private worldText = "world";
    private theAnswerToTheUniverse = 42;
}
```

Is changed to:

```
@Component( {
    selector: 'my-component',
    template: `
        Hello, {{ worldText }}!
    `
} )
export class MyComponent {
    public worldText = "world";  // <-- made `public`
    private theAnswerToTheUniverse = 42;  // <-- remains as `private`
}
```

Essentially every .html file is parsed looking for identifiers which correspond
to `private` properties in your class, and they are converted to `public`. 


## Running the Utility from the CLI

```
npm install --global angular-aot-fixer

angular-aot-fixer path/to/your/project
```

## Developing

Make sure you have [Node.js](https://nodejs.org) installed. 

Clone the git repo: 

```
git clone https://github.com/gregjacobs/js-to-ts-converter.git

cd js-to-ts-converter
```

Install dependencies:

```
npm install
```

Run Tests:

```
npm test
```
