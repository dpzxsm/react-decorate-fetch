function omitChildren(obj) {
  const {children, ...rest} = obj;
  return rest
}

export {
  omitChildren
}