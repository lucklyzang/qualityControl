import request from '@/api/request';

// 查询所有主任务
export function queryAllMainTasks(data) {
	return request({
	    url: 'majorTask/selectByPage',
	    method: 'get',
			params: data
	  })
}
// 查询单个主任务详情
export function querySingleMainTask(majorId) {
	return request({
	    url: `majorTask/queryById/${majorId}`,
	    method: 'get'
	  })
}