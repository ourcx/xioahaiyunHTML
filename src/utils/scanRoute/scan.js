
let filepath = ["users/14/", "users/14/11111/", "users/14/4f.jpg", "users/14/image.webp", "users/14/image/ssss/"]
let arr1 = []
let maxValue = 0
let index = 0
let result = {}

  // 立即执行函数,要加;
  ; (function () {
    filepath = filepath.filter((item) => {
      const itemPath = item.split("/")
      maxValue = Math.max(maxValue, itemPath.length)// 更新最大深度
      return itemPath.length > 0 // 明确返回布尔值（保留非空路径）
    })
  })()//探查最大值

//扫面路径数组
function scan(filepath) {
  let arr2 = []
  if (index === maxValue - 1) return

  filepath.forEach((item, i) => {
    const itemPath = item.split("/");
    if (!itemPath[index]) {
      //使用null来代替空值
      arr2.push(null)
      return
    }
    arr2.push(itemPath[index])
  })


  if (arr2.length === filepath.length) {
    arr1.push(arr2)
  }

  index++
  //递归
  scan(filepath)

}
//生成目标矩阵
//区分文件夹和文件,是文件夹返回true
function isFile(str) {
  const lastDotIndex = str.lastIndexOf('.');
  return lastDotIndex == -1 && lastDotIndex >= str.length - 1;
}

function buildTree(layers) {
  // 创建虚拟根节点容器
  const root = { children: {} }
  // 遍历每个路径
  for (let pathIdx = 0; pathIdx < layers[0].length; pathIdx++) {
    let currentLevel = root
    // 逐层处理节点
    for (let depth = 0; depth < layers.length; depth++) {
      const nodeValue = layers[depth][pathIdx]
      // 遇到null停止当前路径
      if (nodeValue === null) break
      // 如果当前层级没有该节点则创建
      if (!currentLevel.children[nodeValue]) {
        currentLevel.children[nodeValue] = {
          node: nodeValue,
          children: {},
          type: !isFile(nodeValue)
        };
      }
      // 下钻到子层级
      currentLevel = currentLevel.children[nodeValue];
    }
  }

  // 返回实际根节点（users节点）
  return root.children.users;
}

scan(filepath)

const tree = buildTree(arr1);


const routeArr = ["users","14"]
//路径数组
//路径指针

function deepHover(json){
  if(json.node==routeArr[routeArr.length-1]){
    return json[children].children
  }else{
    json=json.children
    deepHover(json)
  }
}
console.log(deepHover())

