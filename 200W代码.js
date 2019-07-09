/*eslint-disable*/
function $recursive(dataArr, ops) {
  if (!ops) ops = {};
  const idKey = ops.idKey || 'key';
  const parentKey = ops.parentKey || 'parent';
  const childKey = ops.childKey || 'children';
  const mapData = {};
  const newData = [];
  let routerListData = [];
  let routerListData2 = [];
  // 创建键值map对象
  for (let i = 0, l = dataArr.length; i < l; i++) {
    mapData[dataArr[i][idKey]] = dataArr[i];
  }
  // 生成根节点
  for (let i = 0, l = dataArr.length; i < l; i++) {
    const item = dataArr[i];
    const parent = mapData[item[parentKey]];
    if (parent) {
      if (!parent[childKey]) parent[childKey] = [];
      set(parent[childKey], item);
    } else {
      item.isParent = true;
      set(newData, item);
    }
  }

// 插入节点
  function set(parent, data) {
    if (typeof ops.format === "function") {
      let child = data[childKey];
      data = ops.format(data);
      if (data === false) return;
      if (child)
        data[childKey] = child;
    }
    parent.push(data);
  }

  // 方案一
  newData.map((item) => {
    let routerPath = item[parentKey] ? item[parentKey]+'/' : '';
    let currentRouter = [];
    setRouter(item, routerPath, currentRouter);
    currentRouter.map((item) => {
      routerListData.push(item)
    });
  });

  function setRouter(item, routerPath, currentRouter) {
    if (item[childKey] && item[childKey].length) {
      routerPath = routerPath  + item.key+'/';
      deepRouterPath(item[childKey], routerPath, currentRouter)
    } else {
      routerPath = routerPath + item.key+'/';
      currentRouter.push({path: routerPath, component: item.url})
    }
  }

  function deepRouterPath(arryChidren, routerPath, currentRouter) {
    arryChidren.map((item) => {
      setRouter(item, routerPath, currentRouter)
    })
  }

  //方案二
  // console.log(routerListData);
  dataArr.filter(item => item.url.length > 0).map(item => {
    let fullpath = [item.key];
    addFullpath(item, fullpath);
  });

  function addFullpath(item, fullpath) {
    if (mapData[item[parentKey]]) {
      fullpath.unshift(item[parentKey]);
      addFullpath(mapData[item[parentKey]], fullpath)
    } else {
      if (item[parentKey]) {
        fullpath.unshift(item[parentKey]);
        routerListData2.push({path: fullpath.join('/'), component: mapData[fullpath[fullpath.length - 1]]});
      } else {
        routerListData2.push({path: fullpath.join('/'), component: mapData[fullpath[fullpath.length - 1]]});
        //  fullpath = fullpath;
      }
    }
  }
  console.log(routerListData2);
  return {newData, routerListData};
}


export default $recursive
/*$paraGET(API.MENU).then(e => {
  getRouter = $recursive(e.data.result, {
    format: function (data) {
      let component;
      if (data.url) {
        component = data.url.split('.')[0];
        try {
          component = layoutImport(component);
        } catch (e) {
          component = Layout;
        }
      } else {
        component = Layout;
      }

      data.title = data.name;
      return {
        "path": (data.isParent ? '/' : '') + data.key,
        "component": component,
        "name": data.name,
        "meta": data
      };
    }
  });
  getRouter.push({
    "path": '/',
    "component": Layout,
    "name": '',
    "meta": {}
  });
  console.log(getRouter);
  routerGo(to, next);// 执行路由跳转方法
});*/
