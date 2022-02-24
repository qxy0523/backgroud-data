import myAxios from "@/utils/request"

// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList

// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr


// POST /admin/product/saveAttrInfo
// saveAttrInfo


export default {
  attrInfoList(category1Id, category2Id, category3Id) {
    return myAxios({
      url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "get"
    })
  },
  remove(attrId) {
    return myAxios({
      url: `/admin/product/deleteAttr/${attrId}`,
      method: "delete"
    })
  },
  //添加和修改公用一个接口
  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr) {
    return myAxios.post('/admin/product/saveAttrInfo', attr)
  }
}
