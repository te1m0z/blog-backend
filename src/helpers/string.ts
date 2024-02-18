function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
}

export {
  toCamelCase,
}
