import {
  login,
  logout,
  getInfo
} from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  resetRouter,
  allAsyncRoutes,
  constantRoutes,
  anyRoute,
  default as router
} from '@/router'
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: '',

//   }
// }

// const state = getDefaultState()
// 处理routes，从全部AllRoutes中筛选出routes中的路由
// 最终获取的routes，是当前用户的所有路由信息
// routesArray请求返回过来的route名称组成的数组
function filterAsyncRouters(allAsyncRoutes, routesArray) {
  //从全部异步路由中筛选出，和routes同名的路由
  let asyncRouters = allAsyncRoutes.filter((item) => {
    //从routes路由名字数组中根据字符串查找名字相同的
    if (routesArray.indexOf(item.name) !== -1) {
      // 再次判断里面是否有children
      if (item.children && item.children.length) {
        // 在次将children给覆盖
        item.children=filterAsyncRouters(item.children,routesArray)
      }
    }
    return true;
  })
  return asyncRouters
}
const state = {
  token: localStorage.getItem("token_key"),
  name: '',
  avatar: '',
  buttons: [],
  roles: [],
  routes: []
}
//退出登录的时候重置路由
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, {
      token: localStorage.getItem("token_key"),
      name: '',
      avatar: '',
      buttons: [],
      roles: [],
      routes: []
    })
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ALL: (state, value) => {
    state.name = value.name,
      state.avatar = value.avatar,
      state.buttons = value.buttons,
      state.roles = value.roles
    // state.routes=value.routes
  },
  SET_ROUTES(state, value) {
    //routes里面放的是所有的路由对象，而非路由名称
    state.routes=[...constantRoutes,...value,anyRoute]
      // state.routes=constantRoutes.concat(value,anyRoute)
    // 路由动态引入
    // 动态添加路由到路由器当中
    router.addRoutes([...value,anyRoute])
  }
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}
const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        localStorage.setItem("token_key", data.token)
        // setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {
          name,
          avatar,
          buttons,
          roles,
          routes
        } = data

        commit('SET_ALL', {
          name,
          avatar,
          buttons,
          roles,
        })
        commit('SET_ROUTES', filterAsyncRouters(allAsyncRoutes,routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem("token_key") //清除token
        // removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      localStorage.removeItem("token_key") //清除token
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
