// This file intentionally contains "AI slop" patterns

// TODO: fix this later
const data: any = handleStuff(); // idk why this works

function processData(item: any) {
  const result = item.value;
  // FIXME: this is terrible
  return result;
}

// don't touch this
function doThing(data: any): any {
  const temp = data.stuff;
  // somehow works...
  return temp;
}

const response = fetchData(); // TODO
