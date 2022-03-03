// get/admin/product/getCategory1
// getCategory1

// GET /admin/product/getCategory2/{category1Id}
// getCategory2

// GET /admin/product/getCategory3/{category2Id}
// getCategory3

// POST /admin/product/inner/findBaseCategory3ByCategory3IdList
// findBaseCategory3ByCategory3IdList
import myAxios from "@/utils/request"
export default{
    getCategory1(){
      return myAxios({
        url:`/admin/product/getCategory1`,
        method:'get',
      })
    },
    getCategory2(category1Id){
      return myAxios({
        url:`/admin/product/getCategory2/${category1Id}`,
        method:'get',
      })
    }, 
    getCategory3(category2Id){
      return myAxios({
        url:`/admin/product/getCategory3/${category2Id}`,
        method:'get',
      })
    },
}
