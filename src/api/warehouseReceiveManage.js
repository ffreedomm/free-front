import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/warehouseReceiveManage',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/warehouseReceiveManage/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/warehouseReceiveManage',
    method: 'put',
    data
  })
}
