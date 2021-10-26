<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#43c3f4" fontColor="#FFF" title="检查详情" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="flow-wrapper">
			<u-steps :list="flowList" mode="number" :current="flowState-1" active-color="#43c3f4"></u-steps>
		</view>
		<view class="examine-items-table-wrapper">
			<view class="examine-items-table-top">  
				<view class="image-wrapper">
					<image src="/static/img/examine-background.png"></image>
					<view class="examine-items-table-top-content">
						<view class="left">
							<text>总分值</text>
							<text>{{ tableList.length > 0 ? tableList[0]['score'] : ''}}</text>
						</view>
						<view class="right">
							<text>当前得分</text>
							<text>{{tableList.length > 0 ? tableList[0]['resultScore'] : ''}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="examine-items-table-bottom">
				<view class="examine-items-table-bottom-content">
					<view class="start-time">
						<view class="top">
							<text></text>
							<text>开始时间</text>
						</view>
						<view class="bottom">
							{{tableList.length > 0 ? tableList[0]['startTime'] : ''}}
						</view>
					</view>
					<view class="query-end-time">
						<view class="top">
							<text></text>
							<text>质疑截止时间</text>
						</view>
						<view class="bottom">
							{{tableList.length > 0 ? tableList[0]['questionTime'] : ''}}
						</view>
					</view>
					<view class="examine-end-time">
						<view class="top">
							<text></text>
							<text>检查截止时间</text>
						</view>
						<view class="bottom">
							{{tableList.length > 0 ? tableList[0]['finishTime'] : ''}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="subtask-wrapper">
			<view class="subtask-list" v-for="(item,index) in subtaskList" :key="index">
				<view class="subtask-list-title" @click="subtaskEvent(item,index)">
					<view class="subtask-list-center-wrapper">
						<view class="subtask-list-center" :class="{'animate-center':item.isScroll}">
							<view class="subtask-name">
								{{item.subtaskName}}
							</view>
							<view class="subtask-principal">
								<text>负责人/</text>
								<text>{{item.subtaskPrincipal}}</text>
							</view>
						</view>
					</view>	
					<view class="subtask-list-right">
						<view class="subtask-score">
							<text>
								得分:
							</text>
							<text>
								{{item.subtaskScore}}
							</text>
							<text>
								{{`/${item.subtaskFullMark}`}}
							</text>
						</view>
					</view>
					<view class="subtask-list-left">
						<view class="subtask-icon">
							<u-icon name="play-right-fill" v-if="!item.unfold"></u-icon>
							<u-icon name="arrow-down-fill" v-if="item.unfold"></u-icon>
						</view>
					</view>
				</view>
				<view class="subtask-list-content" v-if="item.unfold">
					<view class="subtask-item-wrapper">
						<view class="subtask-item" v-for="(itemInner,indexInner) in item.checkItem" :key="indexInner">
							<view class="subtask-item-title" v-if="itemInner.checkItemList.length > 0">
								<text>
									<u-icon name="file-text"></u-icon>
								</text>
								<text>
									{{itemInner.checkItemName.length == 0 ? '无标签' : itemInner.checkItemName}}
								</text>
							</view>
							<view class="subtask-item-list" v-for="(checkItem,checkIndex) in itemInner.checkItemList" :key="checkIndex"
								@click="checkItemEvent(item,checkItem,index)"
							>
								<view class="subtask-item-list-left">
									<text>
										{{checkItem.itemName}}
									</text>
								</view>
								<view class="subtask-item-list-right" :class="[{'willEvaluateStyle': checkItem.checkState == 0},{'evaluateDStyle': checkItem.checkState == 1},
										{'queryedStyle': checkItem.checkState == 2},{'queryedStyle': checkItem.checkState == 3},{'queryedStyle': checkItem.checkState == 4 && flowState == 3},
										{'willChangeStyle': checkItem.checkState == 4 && flowState == 4},{'changedStyle': checkItem.checkState == 5},
										{'suredStyle': checkItem.checkState == 6},{'noPassStyle': checkItem.checkState == 7},
										{'passStyle': checkItem.checkState == 8}]"
								>
									<text>{{taskItemStatusTransfer(checkItem.checkState)}}</text>
								</view>
								<view class="icon" :class="[{'willEvaluateStyle': checkItem.checkState == 0},{'evaluateDStyle': checkItem.checkState == 1},
										{'willReviewdStyle': checkItem.checkState == 2},{'queryedStyle': checkItem.checkState == 3},{'queryedStyle': checkItem.checkState == 4 && flowState == 3},
										{'willChangeStyle': checkItem.checkState == 4 && flowState == 4},{'changedStyle': checkItem.checkState == 5},
										{'suredStyle': checkItem.checkState == 6},{'noPassStyle': checkItem.checkState == 7},
										{'passStyle': checkItem.checkState == 8}]">
									<u-icon name="arrow-right"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="subtask-btn-wrapper">
			<text class="btn-left" :class="{'btnRightStyle': flowState == 2 || flowState == 4 || flowState == 6}" @click="submitResult">提 交</text>
			<text class="btn-right" @click="backTo">返 回</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		getCache,
		getStringLength
	} from '@/common/js/utils'
	import {
		querySingleMainTask,
		submitTotalTaskDetails
	} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue'
	export default {
		components: {
			navBar,
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				taskTypeText: '',
				flowState: '',
				infoText: '',
				showLoadingHint: false,
				flowList: [
					{
					name: '检查中'
					}, 
					{
						name: '确认检查结果'
					}, 
					{
						name: '复核质疑'
					}, 
					{
						name: '问题整改'
					},
					{
						name: '复查'
					}
				],
				tableList: [],
				subtaskList: []
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'mainTaskId',
				'selectHospitalList',
				'permissionInfo'
			]),
			userName() {
				return this.userInfo.name
			},
			proId() {
				return this.userInfo.proIds.length > 1 ? this.selectHospitalList[0].id : this.userInfo.proIds[0]
			},
			proName() {
				return this.userInfo.hospitalList[0].name
			},
			workerId() {
				return this.userInfo.id
			},
			depName() {
				return this.userInfo.depName
			},
			accountName() {
				return this.userInfo.account
			}
		},
		
		onLoad(options) {
			console.log('权限信息',this.permissionInfo);
			this.taskTypeText = this.titleText
		},
		mounted () {
			this.getMainTaskDetails(this.mainTaskId);
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo',
				'changeDisposeSubTaskData',
				'changeIsSkipDetails',
				'changeCacheIndex'
			]),
			
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: '/qualityPackage/pages/qualityManagement/index/index'
				})
			},
			
			// 判断权限
			judgePermission (arrayInfo) {
				let flag;
				if (arrayInfo.some((item) => { return item['authority'] == 'ROLE_primary'}) 
						&& arrayInfo.some((item) => { return item['authority'] == 'ROLE_sub'})) {
					flag = true
				} else {
					flag = false
				};
				return flag
			},
			
			// 检查项状态转换
			taskItemStatusTransfer (index) {
				let transferStr = '';
				if (index == 0) {
					transferStr = '待评价'
				} else if (index == 1) {
					if (this.flowState == 1) {
						transferStr = '已评价'
					} else {
						transferStr = '待确认'
					}
				}  else if (index == 2) {
					if (this.flowState == 2) {
						transferStr = '已质疑'
					} else {
						transferStr = '待复核'
					}
				}  else if (index == 3) {
					transferStr = '已复核'
				} else if (index == 4) {
					transferStr = '待整改'
				} else if (index == 5) {
					transferStr = '已整改'
				} else if (index == 6) {
					transferStr = '已确认'
				} else if (index == 7) {
					transferStr = '整改未通过'
				} else if (index == 8) {
					transferStr = '整改已通过'
				};
				return transferStr
			},
			
			//提取负责人
			extractPrincipal (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(item.name)
				};
				return temporaryData.join("、")
			},
			
			// 查询主任务详情
			getMainTaskDetails(mainTaskId) {
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				querySingleMainTask(mainTaskId).then((res) => {
					this.showLoadingHint = false;
					this.tableList = [];
					this.subtaskList = [];
					if (res && res.data.code == 200) {
						this.flowState = res.data.data.state;
						if (res.data.data) {
							this.tableList.push({
								id: res.data.data.id,
								startTime: res.data.data.startTime,
								questionTime: res.data.data.questionTime,
								finishTime: res.data.data.finishTime,
								score: res.data.data.score,
								resultScore: res.data.data.resultScore,
								question : res.data.data.question ,// 是否允许质疑
								state : res.data.data.state ,// 任务状态
								reformTime : res.data.data.reformTime //整改结束时间
							});
							if (res.data.data.subTaskList.length > 0) {
								for (let i = 0, len = res.data.data.subTaskList.length; i < len; i++) {
									this.subtaskList.push({
										subId: res.data.data.subTaskList[i].id,
										taskNum: res.data.data.number, // 主任务编号
										enabled: res.data.data.subTaskList[i].enabled, // 是否启用
										majorId: this.mainTaskId,
										majorSubId: res.data.data.subTaskList[i].majorSubId,
										subtaskName: res.data.data.subTaskList[i].name,
										subtaskFullMark: res.data.data.subTaskList[i].score,
										subtaskScore: res.data.data.subTaskList[i].resultScore,
										subtaskPrincipal: this.extractPrincipal(res.data.data.subTaskList[i]['persons']),
										persons: res.data.data.subTaskList[i]['persons'],
										unfold: res.data.data.subTaskList[i].persons.filter((single) => {return single.id == this.workerId}).length > 0 ? true : false,
										isScroll: getStringLength(res.data.data.subTaskList[i].name + this.extractPrincipal(res.data.data.subTaskList[i].persons)) >= 20 ? true : false,
										checkItem: []
									});
									if (res.data.data.subTaskList[i].checkItems.length > 0) {
										for (let innerItem of res.data.data.subTaskList[i].checkItems) {
											// 判断是否存在标签名称
											if (JSON.parse(innerItem['tags']).length == 0) {
												// 判断之前的数组里是否存在无的标签名
												let tagsIndex = this.subtaskList[i]['checkItem'].indexOf(this.subtaskList[i]['checkItem'].filter((tagName) => {  return tagName['checkItemName'].length == 0 })[0]);
												if (tagsIndex != -1) {
													// “复核质疑”和“复查”状态下，任务详情场景只展示“待复核”、“已整改”、“整改未通过”四个状态的检查项
													if (this.flowState == 3 || this.flowState == 5) {
														if (this.flowState == 3) {
															if (innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId')? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														} else {
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 3 && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId')? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}
													} else {
														if (this.flowState == 4) {
															if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId')? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														} else {
															this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																mode : innerItem['mode'], //评价方式
																itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																fullScore : innerItem['fullScore'], //满分
																checkId: innerItem.id, // 检查项id
																taskItemId: innerItem.hasOwnProperty('taskItemId')? innerItem['taskItemId'] : '', // 检查项id
																content : innerItem['content'], //评价内容
																recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
															})
														}
													}
												} else {
													this.subtaskList[i]['checkItem'].push({
														checkItemName: [], //标签名称
														checkItemList: []
													});
													if (this.flowState == 3 || this.flowState == 5) {
														if (this.flowState == 3) {
															if (innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														} else {
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 3 && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}
													} else {
														if (this.flowState == 4) {
															if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}	else {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																mode : innerItem['mode'], //评价方式
																itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																fullScore : innerItem['fullScore'], //满分
																checkId: innerItem.id, // 检查项id
																taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																content : innerItem['content'], //评价内容
																recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
															})
														}
													}
												}
											} else {
												// 按标签给检查项重新分组(标签相同的在同一组)
												if (this.subtaskList[i]['checkItem'].length == 0) {
													this.subtaskList[i]['checkItem'].push({
														checkItemName: JSON.parse(innerItem['tags'])[0]['name'], //标签名称
														checkItemList: []
													});
													if (this.flowState == 3 || this.flowState == 5) {
														if (this.flowState == 3) {
															if (innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														} else {
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 3 && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}
													} else {
														if (this.flowState == 4) {
															if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}	else {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																mode : innerItem['mode'], //评价方式
																itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																fullScore : innerItem['fullScore'], //满分
																checkId: innerItem.id, // 检查项id
																taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																content : innerItem['content'], //评价内容
																recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
															})
														}	
													}
												} else {
													// 判断之前的数组里是否存在相同的标签名
													let tagsIndex = this.subtaskList[i]['checkItem'].indexOf(this.subtaskList[i]['checkItem'].filter((tagName) => { return tagName['checkItemName'] == JSON.parse(innerItem['tags'])[0]['name']})[0]);
													if (tagsIndex != -1) {
														if (this.flowState == 3 || this.flowState == 5) {
															if (this.flowState == 3) {
																if (innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															} else {
																if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 3 && innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															}
														}	else {
															if (this.flowState == 4) {
																if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															} else {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}	
														}
													} else {
														this.subtaskList[i]['checkItem'].push({
															checkItemName: JSON.parse(innerItem['tags'])[0]['name'], //标签名称
															checkItemList: []
														});
														if (this.flowState == 3 || this.flowState == 5) {
															if (this.flowState == 3) {
																if (innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															} else {
																if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 3 && innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															}
														}	else {
															if (this.flowState == 4) {
																if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																	this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																		confirm : innerItem['confirm'], //是否确认地点
																		standard : innerItem['standard'], //评价标准
																		itemName : innerItem['describe'], //检查描述
																		number : innerItem['number'], //检查项编号
																		mode : innerItem['mode'], //评价方式
																		itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																		checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																		score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																		fullScore : innerItem['fullScore'], //满分
																		checkId: innerItem.id, // 检查项id
																		taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																		content : innerItem['content'], //评价内容
																		recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																		recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																	})
																}
															}	else {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	mode : innerItem['mode'], //评价方式
																	itemMode: innerItem.hasOwnProperty('itemMode') ? innerItem['itemMode']: 0, //打分方式
																	checkState: innerItem.hasOwnProperty('state') ? innerItem['state'] : 0, //检查项状态
																	score : innerItem.hasOwnProperty('score') ? innerItem['score'] : 0, //检查项得分
																	fullScore : innerItem['fullScore'], //满分
																	checkId: innerItem.id, // 检查项id
																	taskItemId: innerItem.hasOwnProperty('taskItemId') ? innerItem['taskItemId'] : '', // 检查项id
																	content : innerItem['content'], //评价内容
																	recordDesc: innerItem.hasOwnProperty('recordDesc') ? innerItem['recordDesc'] : '', //记录的描述
																	recordRemarks: innerItem.hasOwnProperty('recordRemarks') ? innerItem['recordRemarks'] : '' //记录的备注
																})
															}
														}
													}
												}
											}
										};
										this.changeDisposeSubTaskData(this.subtaskList)
									}	
								};
								console.log('子任务详情',this.subtaskList);
							}
						}
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
							type: 'warning'
						});
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'warning'
					});
					this.showLoadingHint = false
				})
			},
			
			// 子任务点击事件
			subtaskEvent (item,index) {
				this.subtaskList[index]['unfold'] = !item.unfold
			},
			
			// 判断子任务对应状态是否全部更改完成
			judgeSubTaskItemState (data,state) {
				let temporaryFlag = false;
				for (let i = 0, len = data.length; i < len; i++) {
					for (let j = 0, len = data[i]['checkItem'].length; j < len; j++) {
						for (let k = 0, len = data[i]['checkItem'][j]['checkItemList'].length; k < len; k++) {
							let temporaryData = data[i]['checkItem'][j]['checkItemList'];
							if (this.flowState == 0 || this.flowState == 1 || this.flowState == 2 || this.flowState == 3 || this.flowState == 5 || state == 7) {
								temporaryFlag = temporaryData.some((item) => { return item['checkState'] == state})
							} else {
								if (this.flowState == 4) {
									temporaryFlag = temporaryData.some((item) => { return item['checkState'] == state || item['checkState'] == 7 })
								}
							};
							if (temporaryFlag) {
								return true
							} 
						}
					}
				};
				return temporaryFlag
			},
			
			// 检查项点击事件
			checkItemEvent (item,checkItem,index) {
				// 判断是否为检查者
				if (!this.judgePermission(this.permissionInfo)) {
					this.$refs.uToast.show({
						title: '你没有此操作权限!',
						type: 'warning'
					});
					return
				};
				let temporaryInfo = {
				 	majorSubId: item['majorSubId'],  //主任务子任务关联id
				 	state: checkItem['checkState'],	 //检查项状态
				 	majorId: item['majorId'],		//主任务id
				 	subId: item['subId'],		//子任务id
					checkId: checkItem['checkId'], // 检查项id
					taskItemId: checkItem['taskItemId'], // 检查项id
					fullScore: checkItem['fullScore'], // 满分
					score: checkItem['score'], // 得分
					majorState: this.flowState,		//主任务当前状态
					taskNum: item.taskNum,	//主任务编号
					content : checkItem['content'], //评价内容
					standard : checkItem['standard'], //评价标准
					describe : checkItem['itemName'], //检查描述
					number : checkItem['number'], //检查项编号
					itemMode: checkItem['itemMode'], //打分方式
					recordDesc: checkItem['recordDesc'], //记录描述
					recordRemarks: checkItem['recordRemarks'], //记录备注
					persons: item['persons'] // 子任务负责人
				};
				this.changeSubtaskInfo(temporaryInfo);
				uni.redirectTo({
					url: '/qualityPackage/pages/examineItemDetails/examineItemDetails'
				})
			},
			
			// 提交检查结果
			submitTotalTask (data) {
				this.infoText = '提交中···',
				this.showLoadingHint = true;
				submitTotalTaskDetails(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						let temporaryIndex = {};
						if (this.flowState != 5) {
							if (this.judgeSubTaskItemState(this.subtaskList,7)) {};
							temporaryIndex.current = 1;
							temporaryIndex.isGoingTask = true;
							temporaryIndex.selectIndex = this.flowState + 1
						} else {
							if (this.judgeSubTaskItemState(this.subtaskList,7)) {
								temporaryIndex.current = 1;
								temporaryIndex.isGoingTask = true;
								temporaryIndex.selectIndex = this.flowState - 1
							} else {
								temporaryIndex.current = 2;
								temporaryIndex.isGoingTask = false
							}
						};
						this.changeIsSkipDetails(true);
						this.changeCacheIndex(temporaryIndex);
						this.backTo()
					} else {
						this.$refs.uToast.show({
							title: `${err}`,
							type: 'warning'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'warning'
					});
					this.showLoadingHint = false
				})
			},
		
			// 检查结果提交
			submitResult () {
				// 判断是否为检查者
				if (!this.judgePermission(this.permissionInfo)) {
					this.$refs.uToast.show({
						title: '你没有此操作权限!',
						type: 'warning'
					});
					return
				};
				if (this.flowState == 2 || this.flowState == 4 || this.flowState == 6) {
					return 
				};
				let flag;
				// 根据主任务状态判断子任务对应状态是否全部更改完成
				if (this.flowState == 0 || this.flowState == 1) {
					flag = this.judgeSubTaskItemState(this.subtaskList,0)
				} else if (this.flowState == 2) {
					flag = this.judgeSubTaskItemState(this.subtaskList,1)
				} else if (this.flowState == 3) {
					flag = this.judgeSubTaskItemState(this.subtaskList,2)
				} else if (this.flowState == 4) {
					flag = this.judgeSubTaskItemState(this.subtaskList,4)
				} else if (this.flowState == 5) {
					flag = this.judgeSubTaskItemState(this.subtaskList,5)
				};		
				if (flag) {
					this.$refs.uToast.show({
						title: `请完成所有检查项对应的操作`,
						type: 'warning'
					});
					return
				};
				let temporaryData = {
					id : this.mainTaskId, // 主任务id
					modifyName : this.userName, // 修改人名称
					state : this.flowState + 1 // 主任务状态
				};
				// 有复查未通过的子检查项时把主任务状态更改为上一流程问题整改
				if (this.judgeSubTaskItemState(this.subtaskList,7)) {
					temporaryData['state'] = 4
				};
				this.submitTotalTask(temporaryData)
			}
		}	
	}	
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.container {
		@include content-wrapper;
		background: #f5f5f5;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		}
		.nav {
			width: 100%
		}
		.flow-wrapper {
			padding: 8px 0;
			background: #fff
		}
		.examine-items-table-wrapper {
			padding: 8px 0;
			position: relative;
			.examine-items-table-top {
				height: 70px;
				.image-wrapper {
					position: relative;
					height: 70px;
					width: 100%;
					margin: 0 auto;
					> image {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%
					};
					.examine-items-table-top-content {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 70px;
						display: flex;
						flex-flow: row nowrap;
						justify-content: center;
						align-items: center;
						> view {
							width: 35%;
							text-align: center;
							text {
								&:first-child {
									color: #bfbfbf;
									font-size: 12px;
									margin-right: 8px
								};
								&:last-child {
									color: #fff;
									font-size: 22px;
									font-weight: bold
								}
							}
						}
					}
				}
			};
			.examine-items-table-bottom {
				height: 75px;
				position: relative;
				background: #fff;
				.examine-items-table-bottom-content {
					position: absolute;
					width: 100%;
					height: 60px;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					flex-flow: row nowrap;
					> view {
						margin-right: 10px;
						&:last-child {
							margin-right: 0
						};
						.top {
							font-size: 14px;
							color: black;
							text-align: center;
							> text {
								&:first-child {
									display: inline-block;
									width: 4px;
									height: 4px;
									background: black;
									border-radius: 50%;
									margin-right: 6px;
									vertical-align: middle;
								}
							}
						};
						.bottom {
							font-size: 15px;
							color: #9a9a9a;
							text-align: center
						}
					}
				}
			}
		}
		.subtask-wrapper {
			flex: 1;
			overflow: auto;
			margin-top: 8px;
			.subtask-list {
				background: #fff;
				margin-bottom: 8px;
				&:last-child {
					margin-bottom: 0
				};
				.subtask-list-title {
					width: 100%;
					padding: 10px 6px;
					box-sizing: border-box;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					@include bottom-border-1px(#9b9b9b);
					.subtask-list-left {
						width: 4%
					}
					.animate-center {
						white-space: nowrap;
						animation: 4s wordsLoop linear infinite normal
					}
					@keyframes wordsLoop {
						0% {
							transform: translateX(100%)
						}
						100% {
							transform: translateX(-100%)
						}
					}
					.subtask-list-center-wrapper {
						width: 60%;
						overflow: hidden;
						.subtask-list-center {
							width: 100%;
							>view {
								display: inline-block;
								margin-right: 6px;
								vertical-align: middle;
								font-size: 16px;
								color: #666
							}
							.subtask-name {
								color: black;
								font-weight: bold
							};
							.subtask-principal {
								font-size: 15px;
								color: #9a9a9a;
								text {
									&:first-child {
										margin-right: 4px
									}
								}
							}
						}
					}	
					.subtask-list-right {
						font-size: 15px;
						color: #9a9a9a;
						text-align: right;
						.subtask-score {
							text {
								&:first-child {
									margin-right: 4px
								}
							}
						}
					}
				}
				.subtask-list-content {
					box-sizing: border-box;
					.subtask-item-wrapper {
						.subtask-item {
							@include bottom-border-1px(#d5d5d6);
							.subtask-item-title {
								padding-left: 6px;
								line-height: 30px;
								font-weight: bold;
								background: #fff;
								text {
									&:first-child {
										margin-right: 4px
									}
								}
							}
							.subtask-item-list {
								display: flex;
								flex-flow: row nowrap;
								justify-content: space-between;
								align-items: center;
								padding: 12px 4px;
								&:last-child:after {
									display: none
								}
								.subtask-item-list-left {
									width: 70%;
									color: #666;
									padding-left: 20px
								}
								.subtask-item-list-right {
									width: 20%;
									color: #666;
									text-align: right
								}
								.icon {
									width: 10%;
									color: #666;
									text-align: right
								}
								.willEvaluateStyle {
									color: #FF5722
								}
								.evaluateDStyle {
									color: #FFB800
								}
								.willSureStyle {
									color: #FFB800
								}
								.suredStyle {
									color: #009688
								}
								.willReviewdStyle {
									color: #ff0000
								}
								.queryedStyle {
									color: #ff00ff
								}
								.willChangeStyle {
									color: #1e9fff
								}
								.changedStyle {
									color: #009688
								}
								.noPassStyle {
									color: #ff5500
								}
								.passStyle {
									color: #009688
								}
							}
						}
					}
				}
			}
		}
		.subtask-btn-wrapper {
			height: 60px;
			width: 80%;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text {
				width: 130px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #fff;
				background-image: linear-gradient(to right, #37d5fc , #439bff)
			}
			.btnRightStyle {
				background: #e8e8e8;
				color: #989898
			}
			.btn-right {
				background: #e8e8e8;
				color: #666
			}
		}
	}	
</style>

