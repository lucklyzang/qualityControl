<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="检查详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="flow-wrapper">
			<u-steps :list="flowList" mode="number" :current="flowState-1" active-color="#fa3534"></u-steps>
		</view>
		<view class="examine-items-table-wrapper">
			<t-table border="1" border-color="#cecece">
				<t-tr font-size="12" color="#333" align="left">
					<t-th align="left">开始时间</t-th>
					<t-th align="left">质疑截止时间</t-th>
					<t-th align="left">检查截止时间</t-th>
					<t-th align="left">总分值</t-th>
					<t-th align="left">当前得分</t-th>
				</t-tr>
				<t-tr font-size="12" color="#333" align="left" v-for="item in tableList" :key="item.id">
					<t-td align="left">{{ item.startTime }}</t-td>
					<t-td align="left">{{ item.questionTime }}</t-td>
					<t-td align="left">{{ item.finishTime }}</t-td>
					<t-td align="left">{{ item.score }}</t-td>
					<t-td align="left">{{ item.resultScore }}</t-td>
				</t-tr>
			</t-table>
		</view>
		<view class="subtask-wrapper">
			<view class="subtask-list" v-for="(item,index) in subtaskList" :key="index">
				<view class="subtask-list-title" @click="subtaskEvent(item,index)">
					<view class="subtask-list-left">
						<view class="subtask-icon">
							<u-icon name="play-right-fill" v-show="!item.unfold"></u-icon>
							<u-icon name="arrow-down-fill" v-show="item.unfold"></u-icon>
						</view>
					</view>
					<view class="subtask-list-center-wrapper">
						<view class="subtask-list-center" :class="{'animate-center':item.isScroll}">
							<view class="subtask-name">
								{{item.subtaskName}}
							</view>
							<view class="subtask-full-mark">
								({{`${item.subtaskFullMark}分`}})
							</view>
							<view class="subtask-principal">
								<text>负责人: </text>
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
						</view>
					</view>
				</view>
				<view class="subtask-list-content" v-show="item.unfold">
					<view class="subtask-item-wrapper">
						<view class="subtask-item" v-for="(itemInner,indexInner) in item.checkItem" :key="indexInner">
							<view class="subtask-item-title" v-show="itemInner.checkItemList.length > 0">
								<text>
									<u-icon name="list"></u-icon>
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
								<view class="subtask-item-list-right">
									<text>{{taskItemStatusTransfer(checkItem.checkState)}}</text>
								</view>
								<view class="icon">
									<u-icon name="arrow-right"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="subtask-btn-wrapper">
			<text class="btn-left" :class="{'btnRightStyle': flowState == 2 || flowState == 4 || flowState == 6}" @click="submitResult">提交</text>
			<text class="btn-right" @click="backTo">返回</text>
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
				'mainTaskId'
			]),
			userName() {
				return this.userInfo.name
			},
			proId() {
				return this.userInfo.proIds[0]
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
			console.log('长度',getStringLength('飒飒'));
			this.taskTypeText = this.titleText
		},
		mounted () {
			this.getMainTaskDetails(this.mainTaskId);
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo',
				'changeDisposeSubTaskData'
			]),
			
			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/qualityPackage/pages/qualityManagement/index/index'
				})
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
										isScroll: getStringLength(res.data.data.subTaskList[i].name + res.data.data.subTaskList[i].score + res.data.data.subTaskList[i].persons[0]['name']) >= 20 ? true : false,
										checkItem: []
									});
									if (res.data.data.subTaskList[i].checkItems.length > 0) {
										for (let innerItem of res.data.data.subTaskList[i].checkItems) {
											// 判断是否存在标签名称
											if (JSON.parse(innerItem['tags']).length == 0) {
												// 判断之前的数组里是否存在无的标签名
												let tagsIndex = this.subtaskList[i]['checkItem'].indexOf(this.subtaskList[i]['checkItem'].filter((tagName) => {  return tagName['checkItemName'].length == 0 })[0]);
												if (tagsIndex != -1) {
													// “复核质疑”和“复查”状态下，任务详情场景只展示“待复核”、“已复核”、“已整改”、“整改未通过”四个状态的检查项
													if (this.flowState == 3 || this.flowState == 5) {
														if (this.flowState == 3) {
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 8) {
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
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 8) {
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
															if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 8) {
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
																if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 8) {
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
																if (innerItem['state'] != 6 && innerItem['state'] != 4 && innerItem['state'] != 8) {
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
						title: `${err.msg}`,
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
							if (this.flowState == 0 || this.flowState == 1 || this.flowState == 2 || this.flowState == 5 || state == 7) {
								temporaryFlag = temporaryData.some((item) => { return item['checkState'] == state})
							} else {
								if (this.flowState == 4) {
									temporaryFlag = temporaryData.some((item) => { return item['checkState'] == state || item['checkState'] == 7 })
								} else {
									temporaryFlag = temporaryData.some((item) => { return item['checkState'] != state})
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
						title: `${err.msg}`,
						type: 'warning'
					});
					this.showLoadingHint = false
				})
			},
		
			// 检查结果提交
			submitResult () {
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
					flag = this.judgeSubTaskItemState(this.subtaskList,3)
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
			padding: 4px 0;
			margin-top: 6px;
			background: #fff
		}
		.examine-items-table-wrapper {
			padding: 8px 0;
			margin: 6px 0;
			background: #fff
		}
		.subtask-wrapper {
			flex: 1;
			padding: 4px;
			overflow: auto;
			.subtask-list {
				background: #fff;
				margin-bottom: 4px;
				&:last-child {
					margin-bottom: 0
				};
				.subtask-list-title {
					width: 100%;
					height: 30px;
					padding: 4px;
					box-sizing: border-box;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
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
						width: 75%;
						overflow: hidden;
						.subtask-list-center {
							width: 100%;
							padding-left: 10px;
							>view {
								display: inline-block;
								margin-right: 6px;
								vertical-align: middle
							}
							.subtask-principal {
								text {
									&:first-child {
										margin-right: 4px
									}
								}
							}
						}
					}	
					.subtask-list-right {
						width: 18%;
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
							.subtask-item-title {
								padding-left: 8px;
								line-height: 30px;
								font-weight: bold;
								background: #efefef;
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
								@include bottom-border-1px(#d5d5d6);
								&:last-child:after {
									display: none
								}
								.subtask-item-list-left {
									width: 70%
								}
								.subtask-item-list-right {
									width: 20%;
									text-align: right
								}
								.icon {
									width: 10%;
									text-align: right
								}
							}
						}
					}
				}
			}
		}
		.subtask-btn-wrapper {
			height: 60px;
			width: 70%;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text {
				width: 100px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #fff;
				background: #5ab3ff
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

