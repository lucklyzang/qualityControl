<template>
	<view class="container">
		<hint-dialog v-if="hintDialog" :dialogText="dialogText" :iconColor="iconColor" @setTipMsg='setTipMsg'></hint-dialog>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" :home="false" bgColor="none" fontColor="#FFF" title="子任务详情" @backClick="backTo">
			</nav-bar>
		</view>	
		<view class="content-top-area">
				<image :src="statusBackgroundPng"></image>
				<view class="subtask-list">
					<view class="subtask-item-left">
						<view class="subtask-item-title">{{`${taskMessage.checkName}${taskMessage.examinationType}-${subtaskDetails.subtaskName}`}}</view>
						<view class="subtask-item-oerson">负责人 : {{subtaskDetails.subtaskPrincipal}}</view>
						<view class="subtask-item-grade">得分 : {{`${subtaskDetails.subtaskScore}/${subtaskDetails.subtaskFullMark}`}}</view>
					</view>
					<view class="subtask-item-right">
						<view class="subtask-item-right-top">
								<!-- <u-circle-progress :width="80" :border-width="10" :active-color="subtaskDetails.complete == 100 ? '#289E8E' : subtaskDetails.complete == 0 ? '#ececec' : '#1684FC'" :percent="subtaskDetails.complete">
								</u-circle-progress> -->
								<cCircle :size="30" :percent="subtaskDetails.complete" :animation="true" :direction="180" :circleColor="subtaskDetails.complete == 100 ? '#289E8E':'#1684FC'"></cCircle>
						</view>
						<view class="subtask-item-right-bottom">
							<text>检查已完成:</text>
							<text :class="{'textStyle': subtaskDetails.complete == 100}">{{`${subtaskDetails.complete}%`}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="content-bottom-area" ref="contentBottomArea">
				<scroll-view style="height:100%" scroll-y="true" @scroll="scroll" :scroll-top="scrollTop">
					<view class="subtask-item-list" v-for="(itemInner,indexInner) in subtaskDetails.checkItem" :key="indexInner">
						<view class="subtask-item-name">
							{{itemInner.checkItemName.length == 0 ? '无标签' : itemInner.checkItemName}}
						</view>
						<view class="subtask-subitem-list" v-for="(checkItem,checkIndex) in itemInner.checkItemList" :key="checkIndex">
							<view class="subtask-subitem-top">
								<view class="subtask-subitem-top-left">
									<text>得分 : {{ `${checkItem.checkState == 0 || checkItem.itemMode == 2 ? '-' : checkItem.score}/${checkItem.itemMode == 2 ? '-' : checkItem.fullScore}`}}</text>
								</view>
								<view class="subtask-subitem-top-right" :class="[{'willEvaluateStyle': checkItem.checkState == 0},{'evaluateDStyle': checkItem.checkState == 1},
									{'queryedStyle': checkItem.checkState == 2},{'queryedStyle': checkItem.checkState == 3},{'queryedStyle': checkItem.checkState == 4 && subtaskDetails.flowState == 3},
									{'willChangeStyle': checkItem.checkState == 4 && subtaskDetails.flowState == 4},{'changedStyle': checkItem.checkState == 5},
									{'suredStyle': checkItem.checkState == 6},{'noPassStyle': checkItem.checkState == 7},
									{'passStyle': checkItem.checkState == 8}]"
								>
									<text>{{taskItemStatusTransfer(checkItem.checkState)}}</text>
								</view>
							</view>
							<view class="subtask-subitem-center">
								<text>检查描述 : </text>
								<text>
									{{ checkItem.itemName}}
								</text>
							</view>
							<view class="subtask-subitem-bottom">
								<view class="subtask-subitem-bottom-left" @click="checkItemClickEvent(checkItem)">
									<text>详情</text>
									<u-icon name="arrow-right" color="#1864FF" size="30"></u-icon>
								</view>
								<view class="subtask-subitem-bottom-right" v-if="subtaskDetails.flowState == 1 || subtaskDetails.flowState == 0">
									<view class="no-evaluate" @click="gradeEvent(0,checkItem)" :class="{'noEvaluateStyle' : checkItem.itemMode == 2}">
										<text>不参评</text>
									</view>
									<view class="deduct-mark" @click="gradeEvent(2,checkItem)" :class="{'deductMarkStyle' :checkItem.itemMode == 3}">
										<text>扣分</text>
									</view>
									<view class="full-mark" @click="gradeEvent(1,checkItem)" :class="{'fullMarkStyle': checkItem.itemMode == 1 }">
										<text>满分</text>
									</view>
								</view>
								<view class="operite-query-btn-box" v-if="subtaskDetails.flowState == 3">
									<view class="revaluation" @click="gradeEvent(-1,checkItem)">
										<text>重新评价</text>
									</view>
									<view class="reject" @click="gradeEvent(5,checkItem)">
										<text>驳回</text>
									</view>
								</view>
								<view class="operite-is-pass-btn-box" v-if="subtaskDetails.flowState == 5">
									<view class="no-pass" @click="gradeEvent(7,checkItem)" v-show="checkItem.checkState != 7">
										<text>不通过</text>
									</view>
									<view class="pass" @click="gradeEvent(8,checkItem)">
										<text>通过</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>	
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		addCheckRecord,
		updateCheckRecord,
		updateTaskItem,
		submitTotalTaskDetails,
		getAliyunSign,
		querySingleSubTask
	} from '@/api/task.js'
	import {
		setCache,
		getCache,
		getStringLength
	} from '@/common/js/utils'
	import navBar from "@/components/zhouWei-navBar"
	import timeline from '@/components/chenbin-timeline/timeLine.vue'
	import hintDialog from "@/components/hint-dialog/hint-dialog.vue"
	import timelineItem from '@/components/chenbin-timeline/timelineItem.vue'
	import cCircle from "@/components/my-circle/myCircle.vue"
	export default {
		components: {
			navBar,
			timeline,
			timelineItem,
			hintDialog,
			cCircle
		},
		data() {
			return {
				infoText: '加载中',
				scrollTop: 0,
				hintDialog: false,
				dialogText: '满分',
				iconColor: '#1864FF',
				subtaskList: [],
				subtaskMessage: [],
				statusBackgroundPng: require("@/static/img/status-background.png"),
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'disposeSubTaskData',
				'mainTaskId',
				'subtaskDetails',
				'permissionInfo',
				'taskMessage',
				'subtaskInfo',
				'permissionInfo',
				'selectHospitalList',
				'recordExamineItemScrollTop'
			]),
			userName() {
				return this.userInfo.name
			},
			proId() {
				return this.userInfo.hospitalList.length > 1 ? this.selectHospitalList[0].id : this.userInfo.hospitalList[0].id
			},
			proName() {
				return this.userInfo.hospitalList.length > 1 ? this.selectHospitalList[0].value : this.userInfo.hospitalList[0].name
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
		
		
		mounted() {
			this.getSubtaskDetails(this.subtaskDetails.majorId,this.subtaskDetails.subId);
			console.log('子任务详情',this.subtaskInfo);
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo',
				'changeIsSkipDetails',
				'changeSubtaskDetails',
				'changeCacheIndex',
				'changeEnterGradeSource',
				'changeRecordExamineItemScrollTop',
				'changeIsShowRevaluationBtn',
				'changeIsShowRejectBtn',
				'changeTitleText'
			]),
	
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: '/qualityPackage/pages/examineDetails/examineDetails'
				})
			},
			
			setTipMsg (text) {
				this.hintDialog = false
			},
			
			// 监听检查项列表滚动距离
			scroll (event) {
				//存储列表滚动距离
				this.changeRecordExamineItemScrollTop(Math.ceil(event.detail.scrollTop))
			},
			
			//提取子任务负责人(姓名)
			extractPrincipal (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(item.name)
				};
				return temporaryData.join("、")
			},
			

			//提取子任务负责人(id)
			extractPrincipalId (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(Number(item.id))
				};
				return temporaryData
			},
			
			// 查询子任务详情
			getSubtaskDetails (majorId,subtaskId) {
				this.subtaskList = [];
				this.subtaskMessage = [];
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				querySingleSubTask(majorId,subtaskId).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 200) {
						this.subtaskMessage.push(res.data.data);
						if (this.subtaskMessage.length > 0) {
							for (let i = 0, len = this.subtaskMessage.length; i < len; i++) {
								this.subtaskList.push({
									subId: this.subtaskMessage[i].id,
									taskNum: this.subtaskDetails.taskNum, // 主任务编号
									enabled: this.subtaskMessage[i].enabled, // 是否启用
									majorId: this.subtaskDetails.majorId,
									complete: this.subtaskMessage[i].complete,
									majorSubId: this.subtaskMessage[i].majorSubId,
									subtaskName: this.subtaskMessage[i].name,
									subtaskFullMark: this.subtaskMessage[i].score,
									mainTaskPerson: this.subtaskDetails['mainTaskPerson'],
									subtaskScore: this.subtaskMessage[i].resultScore,
									subtaskPrincipal: this.extractPrincipal(this.subtaskMessage[i]['persons']),
									persons: this.subtaskMessage[i]['persons'],
									unfold: this.subtaskMessage[i].persons.filter((single) => {return single.id == this.workerId}).length > 0 ? true : false,
									isScroll: getStringLength(this.subtaskMessage[i].name + this.extractPrincipal(this.subtaskMessage[i].persons)) >= 20 ? true : false,
									checkItem: []
								});
								if (this.subtaskMessage[i].checkItems.length > 0) {
									for (let innerItem of this.subtaskMessage[i].checkItems) {
										// 判断是否存在标签名称
										if (JSON.parse(innerItem['tags']).length == 0) {
											// 判断之前的数组里是否存在无的标签名
											let tagsIndex = this.subtaskList[i]['checkItem'].indexOf(this.subtaskList[i]['checkItem'].filter((tagName) => {  return tagName['checkItemName'].length == 0 })[0]);
											if (tagsIndex != -1) {
												// “复核质疑”和“复查”状态下，任务详情场景只展示“待复核”、“已整改”、“整改未通过”四个状态的检查项
												if (this.subtaskDetails.flowState == 3 || this.subtaskDetails.flowState == 5) {
													if (this.subtaskDetails.flowState == 3) {
														if (innerItem['state'] != 8 && innerItem['state'] != 6 && innerItem['state'] != 4) {
															this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
																additional : innerItem['additional'], //检查项类型
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
													if (this.subtaskDetails.flowState == 4) {
														if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
															this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
															additional : innerItem['additional'], //检查项类型
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
												if (this.subtaskDetails.flowState == 3 || this.subtaskDetails.flowState == 5) {
													if (this.subtaskDetails.flowState == 3) {
														if (innerItem['state'] != 8 && innerItem['state'] != 6 && innerItem['state'] != 4) {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
																additional : innerItem['additional'], //检查项类型
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
													if (this.subtaskDetails.flowState == 4) {
														if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
															additional : innerItem['additional'], //检查项类型
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
												if (this.subtaskDetails.flowState == 3 || this.subtaskDetails.flowState == 5) {
													if (this.subtaskDetails.flowState == 3) {
														if (innerItem['state'] != 8 && innerItem['state'] != 6 && innerItem['state'] != 4) {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
																additional : innerItem['additional'], //检查项类型
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
													if (this.subtaskDetails.flowState == 4) {
														if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
															this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
															additional : innerItem['additional'], //检查项类型
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
													if (this.subtaskDetails.flowState == 3 || this.subtaskDetails.flowState == 5) {
														if (this.subtaskDetails.flowState == 3) {
															if (innerItem['state'] != 8 && innerItem['state'] != 6 && innerItem['state'] != 4) {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	additional : innerItem['additional'], //检查项类型
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
																	additional : innerItem['additional'], //检查项类型
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
														if (this.subtaskDetails.flowState == 4) {
															if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	additional : innerItem['additional'], //检查项类型
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
															// 静茹了
															this.subtaskList[i]['checkItem'][tagsIndex]['checkItemList'].push({
																confirm : innerItem['confirm'], //是否确认地点
																standard : innerItem['standard'], //评价标准
																itemName : innerItem['describe'], //检查描述
																number : innerItem['number'], //检查项编号
																additional : innerItem['additional'], //检查项类型
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
													if (this.subtaskDetails.flowState == 3 || this.subtaskDetails.flowState == 5) {
														if (this.subtaskDetails.flowState == 3) {
															if (innerItem['state'] != 8 && innerItem['state'] != 6 && innerItem['state'] != 4) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	additional : innerItem['additional'], //检查项类型
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
																	additional : innerItem['additional'], //检查项类型
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
														if (this.subtaskDetails.flowState == 4) {
															if (innerItem['itemMode'] != 2 && innerItem['score'] < innerItem['fullScore'] && innerItem['state'] != 8) {
																this.subtaskList[i]['checkItem'][this.subtaskList[i]['checkItem'].length-1]['checkItemList'].push({
																	confirm : innerItem['confirm'], //是否确认地点
																	standard : innerItem['standard'], //评价标准
																	itemName : innerItem['describe'], //检查描述
																	number : innerItem['number'], //检查项编号
																	additional : innerItem['additional'], //检查项类型
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
																additional : innerItem['additional'], //检查项类型
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
									}
								}
							};
							// 子任务详情数据存入store
							let temporaryObject = {};
							temporaryObject = this.subtaskList[0];
							temporaryObject['flowState'] = this.subtaskDetails.flowState;
							this.changeSubtaskDetails(temporaryObject);
							this.$nextTick(() => {
								// 恢复检查项之前的滚动距离
								this.scrollTop = this.recordExamineItemScrollTop
							})
						}
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
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
					transferStr = '未评价'
				} else if (index == 1) {
					if (this.subtaskDetails.flowState == 1 || this.subtaskDetails.flowState == 0) {
						transferStr = '已评价'
					} else {
						transferStr = '待确认'
					}
				}  else if (index == 2) {
					if (this.subtaskDetails.flowState == 2) {
						transferStr = '请复核'
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
			
			// 评价事件
			gradeEvent(num,checkItem) {
				// 操作过的不允许重复操作
				if (num == 0) {
					if (checkItem.itemMode == 2) { return }
				};
				if (num == 1) {
					if (checkItem.itemMode == 1) { return }
				};
				if (num == 2) {
					if (checkItem.itemMode == 3) { return }
				};
				// -1: '重新评价'
				// 0: '不参评', 点击不跳转，直接提交
				// 1: '满分', 点击不跳转，直接提交
				// 2: '扣分',
				// 5: '驳回',
				// 7: '不通过'
				// 8: '通过', 点击不跳转，直接提交
				// 保存子任务相关信息
				let temporaryInfo = {
				 	majorSubId: this.subtaskDetails['majorSubId'],  //主任务子任务关联id
				 	state: checkItem['checkState'],	 //检查项状态
				 	majorId: this.subtaskDetails['majorId'],		//主任务id
				 	subId: this.subtaskDetails['subId'],		//子任务id
					checkId: checkItem['checkId'], // 检查项id
					taskItemId: checkItem['taskItemId'], // 检查项id
					fullScore: checkItem['fullScore'], // 满分
					score: checkItem['score'], // 得分
					majorState: this.subtaskDetails.flowState,		//主任务当前状态
					taskNum: this.subtaskDetails.taskNum,	//主任务编号
					content : checkItem['content'], //评价内容
					standard : checkItem['standard'], //评价标准
					describe : checkItem['itemName'], //检查描述
					number : checkItem['number'], //检查项编号
					itemMode: checkItem['itemMode'], //打分方式
					recordDesc: checkItem['recordDesc'], //记录描述
					recordRemarks: checkItem['recordRemarks'], //记录备注
					persons: this.subtaskDetails['persons'], // 子任务负责人
					additional: checkItem['additional'], // 检查项类型
					operation: num
				};
				this.changeSubtaskInfo(temporaryInfo);
				if (num == 0 || num == 1 || num == 8) {
					// 直接提交不跳转
					this.sure(num)
				} else {
					if (num == 2) {
						this.changeTitleText('扣分')
					} else if (num == -1) {
						this.changeTitleText('重新评价')
					} else if (num == 5) {
						this.changeTitleText('驳回')
					} else if (num == 7) {
						this.changeTitleText('不通过')
					};
					this.changeEnterGradeSource('/qualityPackage/pages/subtaskDetails/subtaskDetails');
					uni.redirectTo({
						url: '/qualityPackage/pages/grade/grade'
					})
				}
			},
			
			// 提交事件
			sure (num) {
				if (this.subtaskDetails['mainTaskPerson'].indexOf(Number(this.workerId)) == -1 && this.extractPrincipalId(this.subtaskList[0]['persons']).indexOf(Number(this.workerId)) == -1) {
					this.$refs.uToast.show({
						title: '你没有该子任务操作权限!',
						type: 'warning'
					});
					return
				};
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				// 判断操作方式
				if (this.subtaskInfo.operation === 0 || this.subtaskInfo.operation === 1 ) {
					let temporaryData = {
						score: "",
						describe: "",
						file: "",
						remarks: "",
						majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
						state: this.subtaskInfo.state,	     //检查项状态
						majorId: this.subtaskInfo.majorId,		//主任务id
						subId: this.subtaskInfo.subId,		//子任务id
						fullScore: this.subtaskInfo.fullScore,		//满分
						taskNum: this.subtaskInfo.taskNum,	//任务编号
						operator: "检查者",		//检查者（固定）
						itemId: this.subtaskInfo.checkId,			//检查项id
						taskItemId: this.subtaskInfo.taskItemId, //检查项id
						majorState: this.subtaskInfo.majorState, //主任务当前状态
						worker: this.userName,
						additional: this.subtaskInfo.additional, //检查项类型
						mode: this.subtaskInfo.operation == 2 ? 3 : this.subtaskInfo.operation == 1 ? this.subtaskInfo.operation : 2, // 操作方式对应要传的参数值（1满分3扣分2不参评）
						operation: this.subtaskInfo.operation, //操作方式（1满分2扣分0不参评）
						imagePaths: [] //上传图片集合 imageList this.imgArr
					};
					if (this.subtaskInfo.operation === 1) {
						// 满分时score字段赋值为满分
						temporaryData['score'] = this.subtaskInfo.fullScore;
					};
					// 判断检查项状态
					if (this.subtaskInfo.state === 0) {
						temporaryData['state'] = this.subtaskInfo.state + 1;
						delete temporaryData.taskItemId;
						this.addCheckRecordMethod(num,temporaryData)
					} else {
						this.updateCheckRecordMethod(num,temporaryData)
					}
				} else {
					let temporaryData = {
						score: this.subtaskInfo.score,  //得分
						describe: "",
						file: "",
						remarks: "",
						majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
						state: 8,	     //检查项状态
						majorId: this.subtaskInfo.majorId,		//主任务id
						subId: this.subtaskInfo.subId,		//子任务id
						fullScore: this.subtaskInfo.fullScore,		//满分
						taskNum: this.subtaskInfo.taskNum,	//任务编号
						operator: "检查者",		//检查者（固定）
						itemId: this.subtaskInfo.checkId,			//检查项id
						taskItemId: this.subtaskInfo.taskItemId, //检查项id
						majorState: this.subtaskInfo.majorState,		//主任务当前状态
						worker: this.userName,
						additional: this.subtaskInfo.additional, //检查项类型	
						operation: this.subtaskInfo.operation	//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
					};
					this.updateTaskItemRecordMethod(num,temporaryData)
				}
			},
			
			// 任务详情检查项第一次操作（满分，扣分，不参评）
			addCheckRecordMethod (num,data) {
				addCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.hintDialog = true;
						if (num == 1) {
							this.dialogText = '已满分';
							this.iconColor = '#289E8E'
						} else if (num == 0) {
							this.dialogText = '已放弃';
							this.iconColor = '#F2A15F'
						};
						this.getSubtaskDetails(this.subtaskDetails.majorId,this.subtaskDetails.subId);
						if (this.subtaskInfo['majorState'] == 0) {
							// 判断该任务是否为第一次提交(是则更改主任务状态为检查中)
							if (!this.judgeSubTaskItemState(this.disposeSubTaskData,0)) {
								this.submitTotalTask({
									id : this.mainTaskId, // 主任务id
									modifyName : this.userName, // 修改人名称
									state : 1 // 主任务状态
								})
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
			
			// 任务详情检查项更新操作（满分，扣分，不参评）
			updateCheckRecordMethod (num,data) {
				updateCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.hintDialog = true;
						if (num == 1) {
							this.dialogText = '已满分';
							this.iconColor = '#289E8E'
						} else if (num == 0) {
							this.dialogText = '已放弃';
							this.iconColor = '#F2A15F'
						};
						this.getSubtaskDetails(this.subtaskDetails.majorId,this.subtaskDetails.subId)
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
			
			//任务详情检查项操作（质疑，确认，复核质疑，上传整改记录，通过，不通过）
			updateTaskItemRecordMethod (num,data) {
				updateTaskItem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.hintDialog = true;
						if (num == 8) {
							this.dialogText = '已通过';
							this.iconColor = '#289E8E'
						} else if (num == -1) {
							this.dialogText = '评价成功';
							this.iconColor = '#1864FF'
						};
						this.getSubtaskDetails(this.subtaskDetails.majorId,this.subtaskDetails.subId)
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
			
			// 判断子任务对应状态是否全部更改完成
			judgeSubTaskItemState (data,state) {
				let temporaryFlag = false;
				for (let i = 0, len = data.length; i < len; i++) {
					for (let j = 0, len = data[i]['checkItem'].length; j < len; j++) {
						for (let k = 0, len = data[i]['checkItem'][j]['checkItemList'].length; k < len; k++) {
							let temporaryData = data[i]['checkItem'][j]['checkItemList'];
								temporaryFlag = temporaryData.some((item) => { return item['checkState'] != state})
							if (temporaryFlag) {
								return true
							} 
						}
					}
				};
				return temporaryFlag
			},
			// 更改任务主状态
			submitTotalTask (data) {
				submitTotalTaskDetails(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						let temporaryIndex = {};
						temporaryIndex.current = 1;
						temporaryIndex.isGoingTask = true;
						temporaryIndex.selectIndex = 1;
						this.changeIsSkipDetails(true);
						this.changeCacheIndex(temporaryIndex)
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
							type: 'warning'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'warning'
					})
				})
			},
			
			// 检查项详情点击事件
			checkItemClickEvent (checkItem) {
				// 同时没有主任务和子任务的权限
				if (this.subtaskDetails['mainTaskPerson'].indexOf(Number(this.workerId)) == -1 && this.extractPrincipalId(this.subtaskList[0]['persons']).indexOf(Number(this.workerId)) == -1) {
					this.$refs.uToast.show({
						title: '你没有该子任务操作权限!',
						type: 'warning'
					});
					return
				};
				this.changeIsShowRevaluationBtn(true);
				this.changeIsShowRejectBtn(true);
				let temporaryInfo = {
				 	majorSubId: this.subtaskDetails['majorSubId'],  //主任务子任务关联id
				 	state: checkItem['checkState'],	 //检查项状态
				 	majorId: this.subtaskDetails['majorId'],		//主任务id
				 	subId: this.subtaskDetails['subId'],		//子任务id
					checkId: checkItem['checkId'], // 检查项id
					taskItemId: checkItem['taskItemId'], // 检查项id
					fullScore: checkItem['fullScore'], // 满分
					score: checkItem['score'], // 得分
					majorState: this.subtaskDetails.flowState,		//主任务当前状态
					taskNum: this.subtaskDetails.taskNum,	//主任务编号
					content : checkItem['content'], //评价内容
					standard : checkItem['standard'], //评价标准
					describe : checkItem['itemName'], //检查描述
					number : checkItem['number'], //检查项编号
					itemMode: checkItem['itemMode'], //打分方式
					recordDesc: checkItem['recordDesc'], //记录描述
					recordRemarks: checkItem['recordRemarks'], //记录备注
					persons: this.subtaskDetails['persons'], // 子任务负责人
					additional: checkItem['additional'] // 检查项类型
				};
				this.changeSubtaskInfo(temporaryInfo);
				uni.redirectTo({
					url: '/qualityPackage/pages/examineItemDetails/examineItemDetails'
				})
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
		background: #f8f8f8;
		padding-bottom: 0;
		position: relative;
		font-size: 14px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.nav {
			position: fixed;
			width: 100%;
			height: 88px;
			top: 0;
			z-index: 10;
			left: 0
		};
		.content-top-area {
			position: relative;
			width: 100%;
			margin: 0 auto;
			height: 200px;
			>image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0
			};
			.subtask-list {
				width: 96%;
				position: absolute;
				top: 12vh;
				left: 2%;
				background: #fff;
				margin-bottom: 8px;
				display: flex;
				border-radius: 6px;
				flex-flow: row nowrap;
				justify-content: space-between;
				align-items: center;
				border: 1px solid #e7e7e7;
				padding: 10px;
				box-sizing: border-box;
				box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
				&:last-child {
					margin-bottom: 0
				};
				.subtask-item-left {
					width: 70%;
					.subtask-item-title {
						margin-bottom: 6px;
						color: #101010;
						word-break: break-all;
						font-size: 16px;
					};
					.subtask-item-oerson {
						margin-bottom: 6px;
						word-break: break-all;
						color: #9E9E9A;
						font-size: 14px;
						margin: 12px 0
					};
					.subtask-item-grade {
						font-size: 12px;
						width: 110px;
						padding: 0 6px;
						color: #1864FF;
						border: 1px solid #1864FF;
						height: 24px;
						border-radius: 20px;
						text-align: center;
						line-height: 24px;
					}
				};
				.subtask-item-right {
					width: 30%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.subtask-item-right-top {};
					.subtask-item-right-bottom {
						margin-top: 6px;
						.textStyle {
							color: #289E8E !important
						};
						text {
							font-size: 12px;
							&:first-child {
								color: #9E9E9A
							};
							&:last-child {
								color: #1864FF
							}
						}
					}
				}
			}	
		};
		.content-bottom-area {
			width: 96%;
			margin: 0 auto;
			margin-top: 5vh;
			flex: 1;
			overflow: auto;
			.subtask-item-list {
				margin-bottom: 4px;
				&:last-child {
					margin-bottom: 0
				}
				.subtask-item-name {
					height: 40px;
					line-height: 40px;
					font-size: 14px;
					color: #101010;
					font-weight: bold
				};
				.subtask-subitem-list {
					background: #fff;
					padding: 2px 0 12px 0;
					box-sizing: border-box;
					border-radius: 4px;
					margin-bottom: 4px;
					.subtask-subitem-top {
						padding: 0 12px;
						box-sizing: border-box;
						height: 40px;
						display: flex;
						flex-flow: row nowrap;
						align-items: center;
						justify-content: space-between;
						@include bottom-border-1px(rgba(187, 187, 187, 0.47));
						.subtask-subitem-top-left {
							color: #101010;
							font-size: 14px
						};
						.subtask-subitem-top-right {
							color: #1864FF;
							font-weight: bold;
							font-size: 14px
						};
						.willEvaluateStyle {
							color: #1864FF !important
						};
						.evaluateDStyle {
							color: #289E8E !important
						};
						.queryedStyle {
							color: #F2A15F !important
						};
						.willChangeStyle {
							color: #254550 !important
						};
						.changedStyle {
							color: #289E8E !important
						};
						.suredStyle {
							color: #009688 !important
						};
						.noPassStyle {
							color: #ff5500 !important
						};
						.passStyle {
							color: #009688 !important
						}
						
					};
					.subtask-subitem-center {
						padding: 0 12px;
						box-sizing: border-box;
						color: #9E9E9A;
						line-height: 20px;
						font-size: 12px;
						word-break: break-all;
						text-align: justify;
						margin: 4px 0;
						>text {
							&:first-child {
								color: #101010
							}
						}
					};
					.subtask-subitem-bottom {
						display: flex;
						height: 40px;
						align-items: center;
						flex-flow: row nowrap;
						justify-content: space-between;
						padding: 0 12px;
						box-sizing: border-box;
						.subtask-subitem-bottom-left {
							>text {
								font-size: 12px;
								color: #1864FF;
								font-weight: bold;
								margin-right: 20px
							};
							::v-deep {
								.u-icon {
									vertical-align: middle
								}
							}
						};
						.subtask-subitem-bottom-right {
							display: flex;
							align-items: center;
							flex-flow: row nowrap;
							justify-content: flex-end;
							flex: 1;
							font-size: 12px;
							>view {
								width: 60px;
								height: 30px;
								text-align: center;
								line-height: 30px;
								border-radius: 6px
							};
							.no-evaluate {
								color: #fff;
								background: #f2a15f
							};
							.noEvaluateStyle {
								color: #f5b47f !important;
								border: 1px solid #f5b47f !important; 
								box-sizing: border-box !important;
								background: #fff !important
							};
							.deduct-mark {
								color: #fff;
								margin: 0 8px;
								background: #e86f50
							};
							.deductMarkStyle {
								color: #ec886d !important;
								border: 1px solid #ec886d !important;
								box-sizing: border-box !important;
								background: #fff !important
							}
							.full-mark {
								color: #fff;
								background: #289e8e
							};
							.fullMarkStyle {
								color: #289e8e !important;
								border: 1px solid #289e8e !important;
								box-sizing: border-box !important;
								background: #fff !important
							}
						};
						.operite-query-btn-box {
							display: flex;
							align-items: center;
							flex-flow: row nowrap;
							justify-content: flex-end;
							flex: 1;
							font-size: 12px;
							>view {
								padding: 0 8px;
								height: 30px;
								text-align: center;
								line-height: 30px;
								border-radius: 6px
							};
							.revaluation {
								color: #fff;
								background: #1864FF
							};
							.revaluationStyle {
								color: #f5b47f !important;
								width: 1px solid #f5b47f !important; 
								box-sizing: border-box !important;
								background: #fff !important
							};
							.reject {
								color: #fff;
								margin-left: 8px;
								background: #E86F50
							};
							.rejectStyle {
								color: #ec886d !important;
								width: 1px solid #ec886d !important;
								box-sizing: border-box !important;
								background: #fff !important
							}
						};
						.operite-is-pass-btn-box {
							display: flex;
							align-items: center;
							flex-flow: row nowrap;
							justify-content: flex-end;
							flex: 1;
							font-size: 12px;
							>view {
								padding: 0 8px;
								height: 30px;
								text-align: center;
								line-height: 30px;
								border-radius: 6px
							};
							.no-pass {
								color: #fff;
								background: #E86F50
							};
							.noPassStyle {
								color: #f5b47f !important;
								width: 1px solid #f5b47f !important; 
								box-sizing: border-box !important;
								background: #fff !important
							};
							.pass {
								color: #fff;
								margin-left: 8px;
								background: #289E8E
							};
							.passStyle {
								color: #ec886d !important;
								width: 1px solid #ec886d !important;
								box-sizing: border-box !important;
								background: #fff !important
							}
						}
					}
				}
			}
		}
	}	
</style>





