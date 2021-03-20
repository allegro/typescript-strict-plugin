# Typescript strict mode plugin

Typescript plugin that allows turning on strict mode in specific files or directories.

## Do i need this plugin?
This plugin was created for bigger repositories that want to incorporate typescript strict mode, but project is so big that refactoring everything would take ages. This plugin allows user to simply put `//@ts-strict` comment to a top of a file and turn a strict mode to that file. If needed, strict mode can be turned on to directories too.

## How to install

 Use your favourite install tool:
```bash
npm i --save-dev scoped-typescript-plugin
```
or yarn 
```bash
yarn add -D scoped-typescript-plugin
```
and add plugin to your `tsconfig.json`:
```json
{
 "compilerOptions": {
   ...
   "strict": false,
  "plugins": [
   {
    "name": "scoped-typescript-plugin"
   }
  ]
 }
}
```
Thats it!

## Configuration
Plugin takes one extra non mandatory argument `paths` that is an array of relative or absolute paths of directories that should be included.
```json
{
  "compilerOptions": {
    ...
    "strict": false,
    "plugins": [
      {
        "name": "scoped-typescript-plugin",
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

#Examples
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
        "name": "scoped-typescript-plugin"
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
        "name": "scoped-typescript-plugin",
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
