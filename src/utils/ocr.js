
import axios from 'axios'
import { artifactsData } from "@asset/artifacts";

const translatePropsMap = {
  hp: 'lifeStatic',
  er: 'recharge',
  cd: 'criticalDamage',
  cr: 'critical',
  pyro: 'fireBonus',
  atk: 'attack',
  df: 'defend'
}

const positionMap = {
  '生之花': 'flower',
  '死之羽': 'feather',
  '时之沙': 'sand',
  '空之杯': 'cup',
  '理之冠': 'head'
}

function getTagName(tag, value) {
  const localName = translatePropsMap[tag]
  if (['atk', 'df'].includes(tag)) {
    return `${ localName }${ value.includes('%') ? 'Percentage' : 'Static' }`
  }
  return localName
}

export const callOcrGetArtifactProps = async image => {
  const { data } = await axios.post('https://api.genshin.pub/api/v1/app/ocr', {
    image
  })

  const { name, pos, main_item, sub_item } = data

  // const { name, pos, main_item, sub_item } = await import('./data.json')

  return {
    setName: Object.values(artifactsData).find(i => i[positionMap[pos]].chs === name).eng,
    position: positionMap[pos],
    mainTag: {
      name: getTagName(main_item.type, main_item.value),
      value: main_item.value.replace('%', '')
    },
    normalTags: sub_item.map(({ type, value }) => ({
      name: getTagName(type, value),
      value: value.replace('%', '')
    }))
  }
}
