# typescript language service plugin tutorial

My first plugin that customize autocomplete suggestions and add a refactor suggestion. So I made kind of a tutorial example with detailed explanations. See the tutorial - with code and screen-cast here : https://cancerberosgx.github.io/typescript-plugins-of-mine/sample-ts-plugin1/src/

![plugin tutorial](doc-assets/eplugin-screencast.gif)

## How to test plugins.

 For example, we have sample-ts-plugin1 and sample-ts-plugin1-sample-project
* `code sample-ts-plugin1-sample-project`
* because it has .vscode/settings.json -  "typescript.tsdk": "node_modules/typescript/lib"  it vscode should use typescript version from its node_modules. 
* ** verify in vscode "select typescript version" of the workspace. and reload tsserver
* because tsconfig.json has `plugins` installing sample-ts-plugin1 that plugin should be loaded by tsserver. 
(https://cancerberosgx.github.io/typescript-plugins-of-mine/sample-ts-plugin1/plugin-screencast.gif)[see screencast]
* select one identifier in the editor and you will see refactor suggestions. Also it wont autocomplete a.caller , only thisIsTheOnlyThatWillAutoComplete proeprty
* now make a change in the plugin, like changing the string "sebarefactiondesc", run "rush rebuild", restart ts server in vscode and that label should be shown as refactor suggestion label. 
* for debugging and seeing messages from plugin in tsserver exec: 
 `export TSS_LOG="-logToFile true -file `pwd`/tsserver_log.log -level verbose"`


#How to use: 
```sh
npm i --save-dev sample-ts-plugin1
```

in your `tsconfig.json`, add the plugin: 

```json
{
  "compilerOptions": {
    ...
    "plugins": [{
        "name": "sample-ts-plugin1",
        "remove": ["caller", "callee", "getDay"]
    }]
    ...
  }
}
```

Make sure you have installed typescript in your project (`npm i --save-dev typescript`) the editor you are using uses that typescript and not another. For example, Visual Studio Code comes with its own typescript version, so I need to "Select TypeScript Version" of the workspace: 
```json
{
  // Specifies the folder path containing the tsserver and lib*.d.ts files to use.
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

