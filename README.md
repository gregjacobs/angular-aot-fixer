# angular-aot-fixer

Utility to assist in fixing AOT compatibility issues in an Angular codebase.

The utility performs the following transformations: 

1. Turns `private` properties/methods which are accessed by a html 
   template into `public` properties/methods (including any `private` 
   constructor args accessed from the template).

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
   
2. Makes all `@HostListener` methods public
3. If a `@HostListener` includes an argument, but the method does not expect one,
   then the argument is removed. Example: 
   
   ```
   @HostListener( 'window.resize', [ '$event' ] )
   onResize() {
       // ...
   }
   ```
   
   Is changed to:
   
   ```
   @HostListener( 'window.resize' )
   onResize() {
       // ...
   }
   ```

Essentially every .html file is parsed looking for identifiers which correspond
to `private` properties in your class, and they are converted to `public`. 


## Fair Warning

This utility makes modifications to the directory that you pass it. Make sure
you are in a clean git (or other VCS) state before running it in case you need
to revert!


## Running the Utility from the CLI

```
npm install --global angular-aot-fixer

angular-aot-fixer path/to/your/project
```


## Running the Utility from Node

TypeScript: 

```
import { fixAotCompatibility, fixAotCompatibilitySync } from 'angular-aot-fixer';


// Async
fixAotCompatibility( 'path/to/component/files' ).then( 
    () => console.log( 'Done!' ),
    ( err ) => console.log( 'Error: ', err );
); 


// Sync
fixAotCompatibilitySync( 'path/to/component/files' );
console.log( 'Done!' );
```

JavaScript:

```
const { fixAotCompatibility, fixAotCompatibilitySync } = require( 'angular-aot-fixer' );


// Async
fixAotCompatibility( 'path/to/component/files' ).then( 
    () => console.log( 'Done!' ),
    ( err ) => console.log( 'Error: ', err );
); 


// Sync
fixAotCompatibilitySync( 'path/to/component/files' );
console.log( 'Done!' );
```



## Developing

Make sure you have [Node.js](https://nodejs.org) installed. 

Clone the git repo: 

```
git clone https://github.com/gregjacobs/angular-aot-fixer.git

cd angular-aot-fixer
```

Install dependencies:

```
npm install
```

Run Tests:

```
npm test
```
