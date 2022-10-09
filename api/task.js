import request from '@/api/request';
import Qs from 'qs'
// 查询所有主任务
export function queryAllMainTasks(data) {
	return request({
	    url: 'quality/majorTask/selectByPage',
	    method: 'get',
			params: data
	  })
}
// 查询单个主任务详情
export function querySingleMainTask(majorId) {
	return request({
	    url: `quality/majorTask/queryById/${majorId}`,
	    method: 'get'
	  })
}
// 查询单个子任务详情
export function querySingleSubTask(majorId,subTaskId) {
	return request({
	    url: `quality/subTask/queryById/${majorId}/${subTaskId}`,
	    method: 'get'
	  })
}
//任务详情检查项操作（满分，扣分，不参评）newCheckRecord
export function addCheckRecord(data) {
	return request({
		url: 'quality/checkRecord/addCheckRecord',
		method: 'post',
		data
	})
}
//任务详情检查项操作（满分，扣分，不参评）modifyCheckRecord
export function updateCheckRecord(data) {
	return request({
	    url: 'quality/checkRecord/updateCheckRecord',
	    method: 'post',
			data
	  })
}
//任务详情检查项操作（质疑，确认，复核质疑，上传整改记录，通过，不通过）
export function updateTaskItem(data) {
	return request({
	    url: 'quality/checkRecord/updateTaskItem',
	    method: 'post',
			data
	  })
}
// 任务详情整体提交
export function submitTotalTaskDetails(data) {
	return request({
	    url: 'quality/majorTask/update',
	    method: 'put',
			data
	  })
}
// 查询子检查项的检查记录
export function queryItemRecords(checkId) {
	return request({
	    url: `quality/checkRecord/queryAllByCheckId/${checkId}`,
	    method: 'get'
	  })
}
// 查询子检查项详情
export function queryItemDetails(checkId) {
	return request({
	    url: `quality/taskCheckItem/itemInfo/${checkId}`,
	    method: 'get'
	  })
}
// 获取阿里云签名接口
export function getAliyunSign() {
	return request({
	    url: 'quality/oss/getSign',
	    method: 'get'
	})
}
// 查询所有文件列表
export function getFiles(workerId) {
	return request({
	    url: `quality/file/files/${workerId} `,
	    method: 'get'
	})
}