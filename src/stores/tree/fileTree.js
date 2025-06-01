import { defineStore } from "pinia"
import apiClient from "@/utils/api";
export const useFileTreeStore = defineStore('fileTree', {
  state: () => ({
    filepath: [],
    arr1: [],
    maxValue: 0,
    index: 0,
    routeArr: ["users",""],
    sort: "size",
    result: [],
    //这是一个全局的排序策略，作为请求头发给文件列表的api，让他根据这个策略来排序
    // 这里的排序策略是一个字符串，表示排序的方式，比如"size"表示按大小排序，"date"表示按日期排序
    lazyPathArr: [],
    lazyIndex: 20,
    allList: [],
    checked: [],
  }),
  actions: {
    async id(){
      await apiClient.get('/files/init').then(res => {
        console.log(res.data.id)
        localStorage.setItem('id', res.data.id)
        this.routeArr[1]= localStorage.getItem('id')
      })
    },
    async init(path = '') {
      this.maxValue = 0
      const base = path === ""
        ? ""
        : (() => {
          const slicedPath = this.routeArr.slice(2).join('/');
          return slicedPath ? slicedPath + '/' : '';
        })();
      if (path != '') {
        this.routeArr.push(path);
        this.arr1 = [];
        this.index = 0;
        this.filepath = [];
        this.result = [];
      }
      try {
        const res = await apiClient.post('/files/ReplayFile', {
          name: path == "" ? (() => {
            const slicedPath = this.routeArr.slice(2).join('/');
            return slicedPath ? slicedPath + '/' : '';
          })() : base + path + "/"
        });
        if (res.data?.data && Array.isArray(res.data.data)) {
          this.lazyPathArr = res.data.data.slice(this.lazyIndex)
          let lazyPath = res.data.data.slice(0, this.lazyIndex)
          this.filepath = [...lazyPath];
        } else {
          console.warn("API响应的 res.data.data 不存在或不是一个数组。将 filepath 设置为空数组。");
          this.filepath = []; // 如果数据无效或不存在，设置一个默认的空数组
          this.result = []; // 清空结果数组
          return; // 终止函数执行
        }

      } catch (err) {
        console.error("请求失败，请检查：", err);
        this.filepath = []; // 发生错误时，也确保 filepath 是一个有效的空数组
        return; // 终止函数执行
      }

      this.maxV()

      console.log(this.maxValue)
      console.log(this.filepath)
      await this.scan()
    },


    maxV() {
      if (Array.isArray(this.filepath)) {
        const filteredFilepath = this.filepath.filter((item) => {
          if (typeof item !== 'string') {
            console.warn(`filepath 中的项目 "${item}" 不是字符串，将跳过此项目。`);
            return false; // 过滤掉非字符串项
          }

          const itemPath = item.split("/"); // 例如："a/b/c" -> ["a", "b", "c"]
          this.maxValue = Math.max(this.maxValue, itemPath.length); // 先取最大值
          this.maxValue += 1; // 再加一
          return itemPath.length > 0; // 或者根据您的具体需求调整此条件
        });
        this.filepath = filteredFilepath; // 将过滤后的新数组赋给 state
      } else {
        console.error("this.filepath 不是一个数组，无法执行 filter 操作。");
        return; // 终止函数执行
      }
    },


    async special(type) {
      try {
        console.log(type)
        const res = await apiClient.put('/files/special', {
          exts: type,
        });
        if (res.data?.data && Array.isArray(res.data.data)) {
          console.log(res.data.data)
          await this.searchFile(res.data.data)
        } else {
          this.result = []; // 清空结果数组
          return; // 终止函数执行
        }
      } catch (err) {
        console.error("请求失败，请检查：", err);
        this.filepath = []; // 发生错误时，也确保 filepath 是一个有效的空数组
        return; // 终止函数执行
      }
    },

    async searchFile(name) {

      const processPaths = (paths) => {
        return paths.map(path => {
          // 找到最后一个斜杠的位置
          const lastSlashIndex = path.lastIndexOf('/')
          // 提取路径部分（包含末尾斜杠）
          const directory = path.substring(0, lastSlashIndex + 1)
          // 提取文件名部分
          const filename = path.substring(lastSlashIndex + 1)
          return {
            path: directory,
            name: filename
          }
        })
      }
      const s = processPaths(name)
      // 处理路径数组，提取目录和文件名
      console.log(s)

      s.forEach(async (item) => {
        await apiClient.post('/files/baseData', {
          name: item.path.replace(/^users\/14\//, '') + item.name
        }).then(({ data }) => {
          // 处理响应数据
          console.log(data)
          const resData = data?.data || {};
          this.result.push({
            name: item.name,
            type: false,
            basePath: item.path.replace(/^users\/14\//, ''),
            size: (resData['Content-Length'] / 1e6).toFixed(2) + "MB", // 修正字段名访问方式
            date: (resData['Last-Modified']?.slice(0, 16).replace('T', ' ')) || "未知",
            contentType: resData['Content-Type']
          });
        })
      })

      console.log(this.result)
    },



    // 这里的scan函数是递归的，扫描filepath数组中的每个路径，获取每一层的目录和文件名
    async scan() {
      let index = this.index
      const maxValue = this.maxValue
      const filepath = this.filepath
      const arr1 = this.arr1

      console.log(filepath)
      console.log(arr1)

      function scan(filepath) {
        let arr2 = []
        if (index === maxValue - 1) return

        filepath.forEach((item) => {
          const itemPath = item.split("/")
          if (!itemPath[index]) {
            arr2.push(null)
            return
          }
          arr2.push(itemPath[index])
        })

        if (arr2.length === filepath.length) {
          arr1.push(arr2)
        }

        index++
        scan(filepath)
      }

      scan(filepath)
      function isFile(str) {
        if (!str) return false  // 处理null的情况
        const lastDotIndex = str.lastIndexOf('.')
        return lastDotIndex !== -1 && lastDotIndex < str.length - 1
      }

      function buildTree(layers) {
        const root = { children: {} }
        for (let pathIdx = 0; pathIdx < layers[0].length; pathIdx++) {
          let currentLevel = root
          for (let depth = 0; depth < layers.length; depth++) {
            const nodeValue = layers[depth][pathIdx]
            if (nodeValue === null) break
            if (!currentLevel.children[nodeValue]) {
              currentLevel.children[nodeValue] = {
                node: nodeValue,
                children: {},
                type: !isFile(nodeValue)
              }
            }
            currentLevel = currentLevel.children[nodeValue]
          }
        }
        return root.children.users
      }

      let tree = buildTree(arr1)
      console.log(tree)

      function deepFind(node, pathArray, currentIndex = 1) {
        if (currentIndex === pathArray.length) {
          return node.children
        }
        const targetSegment = pathArray[currentIndex]
        const nextNode = node.children?.[targetSegment]
        if (!nextNode) return null
        return deepFind(nextNode, pathArray, currentIndex + 1)
      }

      const targetChildren = deepFind(tree, this.routeArr);
      console.log(targetChildren)

      let basePath = this.routeArr.slice(2).join('/') + "/";

      console.log(basePath)

      // 使用Promise.all处理并行请求
      await Promise.all(Object.entries(targetChildren).map(async ([key, child]) => {
        // try {
        // 构造路径时使用模板字符串
        const path = `${basePath != "/" ? basePath : ""}${child.node}${child.type ? '/' : ''}`;
        // 发起请求
        console.log(path)
        const { data } = await apiClient.post('/files/baseData', {
          name: path
        });

        // 处理响应数据
        const resData = data?.data || {};
        this.result.push({
          name: child.node,
          type: child.type,
          children: child.children,
          size: (resData['Content-Length'] / 1e6).toFixed(2) + "MB", // 修正字段名访问方式
          date: (resData['Last-Modified'] || '').slice(0, 16).replace('T', ' '),
          contentType: resData['Content-Type']
        });
        //这里使用了异步的操作，导致结果和后端传过来的顺序不一致
        // } catch (error) {
        //   console.error(`处理节点 ${child.node} 失败:`, error);
        //   // 可添加错误处理逻辑
        //   return
        // }
      },

      ));
    },


    clearResult() {
      this.result = []
    },

    popRouteArr() {
      if (this.routeArr.length > 2) {
        this.routeArr.pop();
        this.arr1 = [];
        this.index = 0;
        this.filepath = [];
        this.result = [];
        this.routeArr.length == 2 ? this.init() : this.init(this.routeArr[this.routeArr.length - 1]);
        console.log(this.routeArr);
      }
    },


    selectRouteArr(item) {
      if (item != "users") {
        const index = this.routeArr.indexOf(item);
        if (index !== -1) {
          // 截取从开头到目标元素的位置（包含目标元素）
          this.routeArr = this.routeArr.slice(0, index + 1);
          console.log(this.routeArr);
        }
        this.arr1 = [];
        this.index = 0;
        this.filepath = [];
        this.result = [];
        this.init();
      }
    },

    async sortResult() {
      if (this.sort === "size") {
        this.result.sort((a, b) => {
          return parseFloat(a.size) - parseFloat(b.size)
        })
      } else if (this.sort === "date") {
        this.result.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
      } else if (this.sort === "-size") {
        this.result.sort((a, b) => {
          return parseFloat(b.size) - parseFloat(a.size)
        })
      }
      else if (this.sort === "-date") {
        this.result.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
      } else if (this.sort === "name") {
        this.result.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }
    },

    //现在这里要完成一个懒加载的文件功能，每次我请求回来的数据只有百分之十进入加载，其他数据分成x份进入待加载区，当页面滚动到一定高度的时候，启动加载
    // 这里的加载是指将数据从待加载区移动到已加载区，filepath会被情空和加入新的数据进行scan，保证result不动就好了，切换页面会清空待加载区
    lazyLoad() {
      if (this.lazyPathArr.length > 0) {
        this.arr1 = [];
        this.filepath = [...this.lazyPathArr.slice(0, this.lazyIndex)]
        this.lazyPathArr = this.lazyPathArr.slice(this.lazyIndex)
        this.maxV()
        this.scan()
        this.lazyIndex = this.lazyIndex + 20
      }
    },
    //懒加载，在滚动到某一高度时，添加新的数据到result数组里面去
    //这个是无限滚动懒加载，分页加载需要后端配合
    async allFileList() {
      if (this.allList.length > 0) return
      await apiClient.get('/files/treeFIle').then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          this.allList.push(...res.data.data)
        } else {
          console.warn("API响应的 res.data.data 不存在或不是一个数组。将 filepath 设置为空数组。");
          this.allList = []; // 如果数据无效或不存在，设置一个默认的空数组
          return; // 终止函数执行
        }
      })
    },

    //筛选数组的方法
    search(input) {
      console.log(input)
      // 空输入返回空数组
      if (!input || !input.trim()) {
        return [];
      }
      // 转义特殊字符并创建不区分大小写的正则表达式
      const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedInput, 'i');
      // 确保 result 是有效数组
      if (!Array.isArray(this.result) || this.result.length === 0) {
        return [];
      }
      // 只搜索顶层项（不递归子项）
      this.result = this.result.filter(item => {
        return regex.test(item.name);
      });
    },


    async addFolder() {
      const hasExisting = this.result.some(item => item.name === "新建文件夹");
      if (hasExisting) {
        return; // 存在则直接返回，不创建
      }
      const path = this.routeArr.slice(2).join('/');
      await apiClient.post('/files/AddFolder', {
        folderName: path + (path ? '/' : '') + '新建文件夹',
      }).then((res) => {
        if (res.data.code === 200) {
          this.result.push({
            contentType: "application/x-directory",
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            name: "新建文件夹",
            size: "0.00MB",
            type: true,
          });
        } else {
          console.error("创建文件夹失败:", res.data.message);
        }
      }).catch((error) => {
        console.error("请求错误:", error);
      });
    },



    //批量下载
    async batchDownload() {
      const resultArray = Object.keys(this.checked).map(key => `${this.routeArr.slice(2).join("/") ? this.routeArr.slice(2).join("/") + "/" : ""}${key}`);
      console.log(resultArray)
      await apiClient.post('/files/ForDescribe', {
        filename: resultArray
      }).then((res) => {
        const downloadURLs = res.data.previewURLs;

        if (!downloadURLs || !Array.isArray(downloadURLs) || downloadURLs.length === 0) {
          console.error('未获取到有效的下载链接');
          return;
        }
        const createDownload = (url, filename) => {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename || url.split('/').pop(); // 使用URL最后部分作为文件名
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        downloadURLs.forEach((url, index) => {
          setTimeout(() => {
            try {
              const filename = url.substring(url.lastIndexOf('/') + 1);
              console.log(`开始下载: ${filename}`);
              createDownload(url, filename);
            } catch (error) {
              console.error(`下载失败: ${url}`, error);
            }
          }, index * 1000); // 每1秒下载一个文件
        });
      })
    }

  }
})
