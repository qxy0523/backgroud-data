//品牌管理暴漏请求
// /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

// GET /admin/product/baseTrademark/{page}/{limit}
// 分页列表
import myAxios from "@/utils/request"
export default{
    remove(id){
        return myAxios({
            url:`/admin/product/baseTrademark/remove/${id}`,
            methods:"delete"
        })
    },
    /*查看数据是否由id，如果由就删除，如果没就添加 */
    addOrUpdate(trademark){
        if(trademark.id){
          // 修改逻辑
          return myAxios({
            url:'/admin/product/baseTrademark/update',
            method:'put',
            data:trademark
          })
        }else{
          // 添加逻辑
          return myAxios({
            url:'/admin/product/baseTrademark/save',
            method:'post',
            data:trademark
          }) 
        }
      },
    getPageList(page,limit){
        return myAxios({
            url:`/admin/product/baseTrademark/${page}/${limit}`,
            methods:"get",
        })
    }
}