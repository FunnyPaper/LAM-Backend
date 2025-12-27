export function testTypes() {
  const testTypes: ('local' | 'remote')[] = [];

  if(process.env.E2E_ENABLE_LOCAL=='1') {
    testTypes.push('local')
  }

  if(process.env.E2E_ENABLE_REMOTE=='1') {
    testTypes.push('remote')
  }

  return testTypes;
}