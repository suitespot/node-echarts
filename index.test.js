import test from 'ava';
import { readFileSync, unlinkSync } from 'fs';

import echarts from '.';
import option from './demo/area';

const testImage = readFileSync('./demo/area.png')

test('save file', async (t) => {
  const path = __dirname + '/area.png'

  echarts({
    path,
    width: 1000,
    height: 500,
    option,
    exportOpts: {
      backgroundColor: 'transparent',
    }
  })

  const file = readFileSync(path)

  t.is(file.length, testImage.length)

  unlinkSync(path)
})

test('return buffer instead of write file', async (t) => {
  const data = await echarts({
    width: 1000,
    height: 500,
    option,
    exportOpts: {
      backgroundColor: 'transparent',
    },
  });

  t.is(data.length, testImage.length)
})
