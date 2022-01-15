# Typescript strict mode plugin

Typescript plugin that allows turning on strict mode in specific files or directories.

## Do I need this plugin?
`typescript-strict-plugin` was created mainly for existing projects that want to incorporate typescript strict mode, but project is so big that refactoring everything would take ages.


Our plugin allows adding strict mode to a TypeScript project without fixing all the errors at once. By adding `//@ts-strict-ignore` comment at the top of a file, its whole content will be removed from strict type checking. To ease migrating a project to use this plugin, you can use `tsc-strict --updateComment` script, which adds the ignore comment to all files that contain at least one strict error.


TypeScript plugins don't work at compile-time. They will show errors in your IDE, but they won't appear during compilation.
To check strict errors in marked files you can use `tsc-strict` script. This command line tool is created to check for files that should be checked with strict rules in compilation time.
It finds all relevant files and checks for strict typescript errors only for that files.
Therefore, we have strict errors inside our files and during build time.


## How to install

 Use `npm`:
```bash
npm i --save-dev typescript-strict-plugin
```
or yarn 
```bash
yarn add -D typescript-strict-plugin
```
add plugin to your `tsconfig.json`:
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
and run the migration script
```
tsc-strict --updateComments
```
That's it! You should be able to see strict typechecking in files without the `@ts-strict-ignore` comment. To make these files strict too, just remove its' ignore comments.

## Configuration
Plugin takes one extra non-mandatory argument `paths` that is an array of relative or absolute paths of directories that should be included. To add strict mode to files from ignored paths you can insert `//@ts-strict` comment.
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
All files contained in those paths will be strictly checked. Yay!

To add cli tool to your build time you can add a script to scripts list in package.json
```json
{
  "scripts": {
    ...,
    "typecheck": "tsc && tsc-strict",
  },
}
```

Then you can simply run 
```shell
yarn tsc-strict
```

All your strict files should be checked from command line.

You can also pass some `tsc` arguments to the `tsc-strict` to override default compiler options e.g.
```shell
yarn tsc-strict --strictNullChecks false
```
would not check for the strict null check in your files. The `tsc-strict` accepts all the arguments that regular `tsc` command
accepts.

## Migrating to v2
Because of difficulties with migrating large projects to strict mode with original `//@ts-strict` comment, we've taken an another approach. Now in version 2.0+ typescript files are strict by default, and to ignore a file, you can use special `//@ts-strict-ignore` comment. It allows to have strict mode in newly created files without remembering about adding strict comment at the top of it. With version 2.0 script `tsc-strict` comes with a new flag, which detects all files with at least one strict error and adds the ignore comment to ease the migration. To update from v1 to v2, you just need to run:
```
tsc-strict --updateComments
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

### Tests
In order to run tests run 

```bash
npm run test
```

## Contributing
Feel free to create PR's and issues.
