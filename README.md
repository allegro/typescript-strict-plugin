# TypeScript Plugin Example

TypeScript Language Service has plugins.
We can make proxy for Language Service.
see [1](https://github.com/Microsoft/TypeScript/pull/12231), [2](https://github.com/Microsoft/TypeScript/issues/11976).

We can't use plugin with tsc command. We should use plugin via tsserver.

## How to try?

```
$ npm install --save-dev @vvakame/typescript-plugin-example
$ cat tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "plugins": [
      {
        "name": "@vvakame/typescript-plugin-example",
        // Plugin specific configuration
        "verbose": true,
        "goody": "😻"
      }
    ]
  }
}
```

```
$ git clone https://github.com/vvakame/typescript-plugin-example.git
$ cd typescript-plugin-example
$ npm install && npm run build
$ code .
# open fixture/index.ts and see quickinfo & completion list.
# ⌘+⌥+P > TypeScript: Open TS Server log file
# This is extremely cool!
$ npm run test
# check behavior via tsserver command.
```

## bibliography

* http://qiita.com/Quramy/items/ecf83ecd4093cb7d948e
* https://github.com/angelozerr/tslint-language-service
