var table = document.getElementById('map-table')
var x = 20
var y = 20
var leftPoint = []
var rightPoint = []
var topPoint = []
var bottomPoint = []
// const colors = [
//     '#719FF9',
//     '#71DDB2',
//     '#F5C638',
//     '#E97D64',
//     '#E97D64',
//     '#A084D1',
//     '#A084D1',
//     '#44A8A7',
//     '#FDA7CB',
//     '#96B5C7',
// ]
const colors = [
  '#5B8FF9',
  '#5AD8A6',
  '#F6BD16',
  '#E8684A',
  '#6DC8EC',
  '#9270CA',
  '#FF9D4D',
  '#269A99',
  '#FF99C3',
  '#86AABE',
]

function createTable() {
  let cnt = 0
  for (let i = 0; i < x; i++) {
    let row = document.createElement('tr')
    table.appendChild(row)
    for (let j = 0; j < y; j++) {
      let d = document.createElement('td')
      d.id = `${cnt}-${i}-${j}`
      // d.classList = (i + j) % 2 == 0 ? 'table-td' : 'table-td table-td-gray'
      d.classList = 'table-td'
      d.style.background = Math.random() < 0.5 ? getRandColor() : ''
      d.addEventListener('mouseover', onMouseover)
      d.addEventListener('mouseout', onMouseout)
      d.addEventListener('click', onClick)
      row.appendChild(d)
      cnt += 1
    }
  }
}

function forEach2d(arr, func) {
  arr.forEach((row) => {
    row.forEach((item) => {
      func(item)
    })
  })
}

function forEachIndex(h, w, func) {
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      func(i, j)
    }
  }
}

function findY(id) {
  // 需要高亮的y坐标
  let t = false
  let minY
  let maxY
  let [num, col, cury] = id.split('-').map((item) => Number(item))
  //   console.log(' :>> ', `${col * y + cury}-${col}-${cury}`)
  while (!t && cury >= 0) {
    // console.log(' y--:>> ', `${col * y + cury}-${col}-${cury}`)
    t =
      document.getElementById(`${col * y + cury}-${col}-${cury}`).style
        .background != ''
    cury -= 1
  }
  minY = cury < 0 && !t ? 0 : cury + 2
  t = false
  cury = id.split('-').map((item) => Number(item))[2] + 1
  while (!t && cury < y) {
    // console.log(' y++:>> ', `${col * y + cury}-${col}-${cury}`)
    t =
      document.getElementById(`${col * y + cury}-${col}-${cury}`).style
        .background != ''
    cury += 1
  }
  maxY = cury >= y && !t ? y - 1 : cury - 2
  //   console.log('minY maxY:>> ', minY, maxY)
  let ylist = []
  for (let i = minY; i < maxY + 1; i++) {
    ylist.push(i)
  }
  console.log('ylist :>> ', ylist)
  let leftPoint = ylist[0] == 0 ? null : [col, ylist[0] - 1]
  let rightPoint =
    ylist[ylist.length - 1] == y - 1 ? null : [col, ylist[ylist.length - 1] + 1]
  console.log('leftPoint, rightPoint:>> ', leftPoint, rightPoint)
  return [ylist, leftPoint, rightPoint]
}

function findX(id) {
  // 需要高亮的x坐标
  let t = false
  let minX
  let maxX
  let [num, curx, row] = id.split('-').map((item) => Number(item))
  //   console.log(' :>> ', `${curx * y + row}-${curx}-${row}`)
  while (!t && curx >= 0) {
    // console.log(' x--:>> ', `${curx * y + row}-${curx}-${row}`)
    t =
      document.getElementById(`${curx * y + row}-${curx}-${row}`).style
        .background != ''
    curx -= 1
  }
  minX = curx < 0 && !t ? 0 : curx + 2
  t = false
  curx = id.split('-').map((item) => Number(item))[1]
  while (!t && curx < x) {
    // console.log(' x++:>> ', `${curx * y + row}-${curx}-${row}`)
    t =
      document.getElementById(`${curx * y + row}-${curx}-${row}`).style
        .background != ''
    curx += 1
  }
  maxX = curx >= x && !t ? x - 1 : curx - 2
  //   console.log('minX maxX:>> ', minX, maxX)
  let xlist = []
  for (let i = minX; i < maxX + 1; i++) {
    xlist.push(i)
  }
  // console.log('xlist :>> ', xlist)
  let topPoint = xlist[0] == 0 ? null : [xlist[0] - 1, row]
  let bottomPoint =
    xlist[xlist.length - 1] == x - 1 ? null : [xlist[xlist.length - 1] + 1, row]
  // console.log('topPoint, bottomPoint:>> ', topPoint, bottomPoint)
  return [xlist, topPoint, bottomPoint]
}

function findSameColor(points) {
  pointColor = {}
  console.log('points :>> ', points)
  points.forEach((p, index) => {
    if (!p) {
      return
    }
    p = p.map((v) => Number(v))
    let e = document.getElementById(`${p[0] * y + p[1]}-${p[0]}-${p[1]}`)
    let c = e.style.background
    if (!Object.keys(pointColor).includes(c)) {
      pointColor[c] = [index]
    } else {
      pointColor[c].push(index)
    }
  })
  // console.log('pointColor :>> ', pointColor)
  Object.keys(pointColor).forEach((k) => {
    if (pointColor[k].length > 1) {
      // console.log('pointColor[k] :>> ', pointColor[k])
      pointColor[k].forEach((i) => {
        deleteColor(points[i])
      })
    }
  })
}

function onMouseover(e) {
  let target = e.target.id.split('-').map((v) => Number(v))
  let xlist = []
  let ylist = []

  if (e.target.style.background == '') {
    ;[ylist, leftPoint, rightPoint] = findY(e.target.id)
    ;[xlist, topPoint, bottomPoint] = findX(e.target.id)
    ylist.forEach((yind) => {
      if (yind != target[2]) {
        ele = document.getElementById(
          `${target[1] * y + yind}-${target[1]}-${yind}`
        )
        setColor(ele, true)
      }
    })
    xlist.forEach((xind) => {
      if (xind != target[1]) {
        ele = document.getElementById(
          `${xind * y + target[2]}-${xind}-${target[2]}`
        )
        setColor(ele, true)
      }
    })
  }
}

function onMouseout(e) {
  let target = e.target.id.split('-')
  forEachIndex(x, y, (i, j) => {
    let ele = document.getElementById(`${i * y + j}-${i}-${j}`)
    setColor(ele, false)
  })
}

function onClick(e) {
  findSameColor([leftPoint, rightPoint, topPoint, bottomPoint])
}

function deleteColor(ind) {
  let [i, j] = ind
  let e = getEleByIndex(i, j)
  e.style.background = ''
  // console.log('delete e :>> ', e)
}

function setColor(ele, ifSet) {
  let classes = ele.className.split(' ')
  if (ele.style.color) {
    return
  }
  if (classes.includes('table-td-highlight')) {
    if (!ifSet) {
      let i = classes.indexOf('table-td-highlight')
      classes.splice(i, 1)
      ele.className = classes.join(' ')
    }
  } else {
    if (ifSet) {
      ele.className += ' table-td-highlight'
    }
  }
}

function getRandColor() {
  let l = colors.length
  let num = Math.floor(Math.random() * l)
  return colors[num]
}

function getEleByIndex(m, n) {
  return document.getElementById(`${m * y + n}-${m}-${n}`)
}
createTable()
