export const notConfiguredError = `
typescript-strict-plugin isn't configured in tsconfig.json
        
Please add following configuration:
{
  "compilerOptions": {
    ...
    "plugins": [{
      "name": "typescript-strict-plugin"
    }]
  },
}
`;

export const noStrictFilesError = `
Project does not contain any strict files.
`;
