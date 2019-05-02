import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/materiel',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/materiel/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/materiel',
    method: 'put',
    data
  })
}
