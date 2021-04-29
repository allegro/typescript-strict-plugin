# Typescript strict mode plugin

Typescript plugin that allows turning on strict mode in specific files or directories.

## Do i need this plugin?
This plugin was created for bigger repositories that want to incorporate typescript strict mode, but project is so big that refactoring everything would take ages. This plugin allows user to simply put `//@ts-strict` comment to a top of a file and turn a strict mode to that file. If needed, strict mode can be turned on to directories too.
NOTE: this plugin doesn't work in compile time. It will show errors in your IDE but they won't appear during compilation.

## How to install

 Use `npm`:
```bash
npm i --save-dev typescript-strict-plugin
```
or yarn 
```bash
yarn add -D typescript-strict-plugin
```
and add plugin to your `tsconfig.json`:
```json
{
 "compilerOptions": {
   ...
   "strict": false,
   "plugins": [
    {
     "name": "typescript-strict-plugin"
    }
   ]
 }
}
```
That's it! You should be able to use `@ts-strict` comment to strictly check your files.

## Configuration
Plugin takes one extra non mandatory argument `paths` that is an array of relative or absolute paths of directories that should be included.
```json
{
  "compilerOptions": {
    ...
    "strict": false,
    "plugins": [
      {
        "name": "typescript-strict-plugin",
        "paths": [
          "./src",
          "/absolute/path/to/source/"
        ]
      }
    ]
  }
}
```
All files contained in those paths will be be strictly checked. Yay!

## Examples
Let's consider this type and a variable
```typescript
interface TestType {
   bar: string;
}

const foo: TestType | undefined = undefined;
```
1. No `paths` argument
With `tsconfig.json` like this:
```json
{
  "compilerOptions": {
    ...
    "strict": false,
    "plugins": [
      {
        "name": "typescript-strict-plugin"
      }
    ]
  }
}
```
Typescript will produce errors:
```typescript
//@ts-strict
...
const boo = foo.bar; // TS2532: Object is possibly 'undefined'.
```
Or not, depending on whether we used `ts-strict` or not:
```typescript
//no strict comment here
...
const boo = foo.bar; // no error here
```

2. With `paths` argument
   With `tsconfig.json` like this:
```json
{
  "compilerOptions": {
    ...
    "strict": false,
    "plugins": [
      {
        "name": "typescript-strict-plugin",
         "path": "./src"
      }
    ]
  }
}
```
If file is in the directory typescript will produce errors even if `ts-strict` comment is not in the file :
```typescript
// ./src/index.ts
const boo = foo.bar; // TS2532: Object is possibly 'undefined'.
```
If file is not in the diretory there will be no error
```typescript
// ./lib/index.ts
const boo = foo.bar; // no error here
```
If file is not in the diretory but there is `ts-strict` file will be check with strict mode:
```typescript
// ./lib/index.ts
//@ts-strict
...
const boo = foo.bar; // TS2532: Object is possibly 'undefined'. 
```

## Testing the plugin
### Manually
run
```bash
npm i
```
inside root folder and `sample-project` folder and then run 
```bash
npm run build
```
or
```bash
npm run dev
```
and restart typescript service inside `sample-project`. Files in `sample-project` folder should use a local plugin.
After you made changes to a plugin you should probably restart typescript service in order to reload the plugin.

### E2E tests
In order to run e2e tests run 

```bash
npm run build && npm run e2e
```

## Contributing
Feel free to create PR's and issues.
