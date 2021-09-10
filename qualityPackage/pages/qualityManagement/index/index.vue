<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="任务列表" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="tabs-title">
			<u-tabs :list="statusList" :is-scroll="false" font-size="35" active-color="#2c9af1" inactive-color="#7d7d7d" bar-width="150" :current="current" @change="tabChange"></u-tabs>
		</view>
		<view class="status-select-wrapper" v-if="current === 1">
			<view>状态筛选</view>
			<view>
				<xfl-select 
					:list="flowList"
					:clearable="false"
					:showItemNum="5"
					 @change="statusChange"
					:placeholder = "'placeholder'"
					:initValue="'全部'"
					:selectHideType="'hideAll'"
				>
				</xfl-select>
			</view>
		</view>
		<view class="status-content-wrapper">
			<view class="not-start" v-show="current === 0" :class="{'statusStyle':current != 1}">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-info">
						<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="content-number">
							<text>编号 : </text>
							<text>{{item.serialNumber}}</text>
						</view>
						<view class="content-examination-item">
							<text>考核项目 : </text>
							<text>{{item.examinationItem}}</text>
						</view>
						<view class="content-examination-time">
							<text>考核时间 : </text>
							<text>{{item.examinationTime}}</text>
						</view>
						<view class="content-examination-type">
							<text>检查类型 : </text>
							<text>{{item.examinationType}}</text>
						</view>
						<view class="content-examination-principal">
							<text>检查负责人 : </text>
							<text>{{item.examinationPrincipal}}</text>
						</view>
						<view class="content-examination-startTime">
							<text>开始时间 : </text>
							<text>{{item.examinationStartTime}}</text>
						</view>
						<view class="content-assessment-format">
							<text>评价方式 : </text>
							<text>{{evaluationMethodTransfer(item.assessmentFormat)}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{queryTransfer(item.isQuery)}}</text>
						</view>
						<view class="content-fullMark">
							<text>满分 : </text>
							<text>{{item.fullMark}}</text>
						</view>
						<view class="content-remark">
							<text>备注 : </text>
							<text>{{item.remark}}</text>
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
						<text @click="viewMore(item,index)">查看更多</text>
					</view>
				</view>
			</view>
			<view class="is-going" v-show="current === 1">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-info">
						<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="content-number">
							<text>编号 : </text>
							<text>{{item.serialNumber}}</text>
						</view>
						<view class="content-examination-item">
							<text>考核项目 : </text>
							<text>{{item.examinationItem}}</text>
						</view>
						<view class="content-examination-time">
							<text>考核时间 : </text>
							<text>{{item.examinationTime}}</text>
						</view>
						<view class="content-examination-type">
							<text>检查类型 : </text>
							<text>{{item.examinationType}}</text>
						</view>
						<view class="content-examination-principal">
							<text>检查负责人 : </text>
							<text>{{item.examinationPrincipal}}</text>
						</view>
						<view class="content-examination-startTime">
							<text>开始时间 : </text>
							<text>{{item.examinationStartTime}}</text>
						</view>
						<view class="content-assessment-format">
							<text>评价方式 : </text>
							<text>{{evaluationMethodTransfer(item.assessmentFormat)}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{queryTransfer(item.isQuery)}}</text>
						</view>
						<view class="content-fullMark">
							<text>满分 : </text>
							<text>{{item.fullMark}}</text>
						</view>
						<view class="content-remark">
							<text>备注 : </text>
							<text>{{item.remark}}</text>
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
						<text @click="viewMore(item,index)">查看更多</text>
					</view>
				</view>
			</view>
			<view class="is-completed" v-show="current === 2" :class="{'statusStyle':current != 1}">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-info">
						<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="content-number">
							<text>编号 : </text>
							<text>{{item.serialNumber}}</text>
						</view>
						<view class="content-examination-item">
							<text>考核项目 : </text>
							<text>{{item.examinationItem}}</text>
						</view>
						<view class="content-examination-time">
							<text>考核时间 : </text>
							<text>{{item.examinationTime}}</text>
						</view>
						<view class="content-examination-type">
							<text>检查类型 : </text>
							<text>{{item.examinationType}}</text>
						</view>
						<view class="content-examination-principal">
							<text>检查负责人 : </text>
							<text>{{item.examinationPrincipal}}</text>
						</view>
						<view class="content-examination-startTime">
							<text>开始时间 : </text>
							<text>{{item.examinationStartTime}}</text>
						</view>
						<view class="content-assessment-format">
							<text>评价方式 : </text>
							<text>{{evaluationMethodTransfer(item.assessmentFormat)}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{queryTransfer(item.isQuery)}}</text>
						</view>
						<view class="content-fullMark">
							<text>满分 : </text>
							<text>{{item.fullMark}}</text>
						</view>
						<view class="content-remark">
							<text>备注 : </text>
							<text>{{item.remark}}</text>
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
						<text @click="viewMore(item,index)">查看更多</text>
					</view>
				</view>
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
		setCache,
		getCache
	} from '@/common/js/utils'
	import {
		queryAllMainTasks
	} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue";
	import xflSelect from '@/components/xfl-select/xfl-select.vue';
	export default {
		components: {
			navBar,
			uniList,
			xflSelect,
			uniListItem,
			faIcon
		},
		data() {
			return {
				taskTypeText: '',
				isFresh: false,
				noDataShow: false,
				showLoadingHint: false,
				statusList: [{name: '未开始'},{name: '进行中'},{name: '已完成'}],
				flowList: ['全部','检查中','确认结果中','复核质疑中','整改中','复查中'],
				current: 1,
				goingState: '',
				statusContentList: []
			}
		},
		
		mounted () {
			let data = {
				hospitals : this.proId, //检查项目(指的是医院)
				mode : 1, //评价方式
				type : 1, //任务类型
				persons : this.workerId, //任务负责人
				subPersons : "", //子任务负责人
				startTime: "",//检查时间
				createTime : "", //创建时间
				state : -1, //主任务状态
				page : 1, //页码
				limit : 20 //条数
			};
			this.getAllMainTasks(data)
		},
		
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			let data = {
				hospitals : this.proId, //检查项目(指的是医院)
				mode : 1, //评价方式
				type : 1, //任务类型
				persons : this.workerId, //任务负责人
				subPersons : "", //子任务负责人
				startTime: "",//检查时间
				createTime : "", //创建时间
				state : this.goingState, //主任务状态
				page : 1, //页码
				limit : 20 //条数
			};
			this.isFresh = true;
			if (this.current === 1) {
				if (this.goingState == 0) {
					data.state = -1
				}
			} else if (this.current == 0) {
				data.state = 0
			} else {
				data.state = 6
			};
			this.getAllMainTasks(data)
		},
		
		computed: {
			...mapGetters([
				'titleText',
				'userInfo'
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
			this.taskTypeText = this.titleText
		},
		
		methods: {
			...mapMutations([
				'changeMainTaskId'
			]),
			// 返回上一页
			backTo() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			
			// 任务状态转换
			statusTransfer (index) {
			  switch(index) {
					case 0 :
					return '未开始'
					break;
			    case 1 :
			    return '检查中'
			    break;
			    case 2 :
			    return '确认检查结果'
			    break;
			    case 3 :
			    return '复核质疑'
			    break;
			    case 4 :
			    return '整改中'
					break;
					case 5 :
					return '整改复合'
					break;
					case 6 :
					return '已完成'
			    break;
			  }
			},
			
			// 任务状态提示语转换
			statusInfoTransfer (item,itemSubTask,state) {
				let ownSubTaskList = itemSubTask.filter((innerItem) => { return innerItem['persons'].indexOf(innerItem['persons'].filter((k) => {return k.id == this.workerId})[0]) != -1});
				let otherSubTaskList = itemSubTask.filter((innerItem) => { return innerItem['persons'].indexOf(innerItem['persons'].filter((k) => {return k.id == this.workerId})[0]) == -1});
				console.log('自己',ownSubTaskList,'他人',otherSubTaskList);
				let markedWords = '';
				if (state == 0) {
					markedWords = "还未到达开始时间"
				} else if (state == 1) {
					if (otherSubTaskList.length == 0) {
						if (this.judgeSubTaskItemState(ownSubTaskList,state)) {
							markedWords = "请完成检查"
						} else {
							markedWords = "请等待负责人提交"
						}
					} else {
						if (!this.judgeSubTaskItemState(ownSubTaskList,state)) {
							if (this.judgeSubTaskItemState(otherSubTaskList,state)) {
								markedWords = "请等待其它检查者完成检查"
							} else {
								markedWords = "请等待负责人提交"
							}
						} else {
							markedWords = "请完成检查"
						}
					}
				} else if (state == 2) {
					markedWords = "请等待被检查者确认检查结果"
				} else if (state == 3) {
					if (otherSubTaskList.length == 0) {
						if (this.judgeSubTaskItemState(ownSubTaskList,state)) {
							markedWords = "请完成复核质疑"
						} else {
							markedWords = "请等待负责人提交"
						}
					} else {
						if (!this.judgeSubTaskItemState(ownSubTaskList,state)) {
							if (this.judgeSubTaskItemState(otherSubTaskList,state)) {
								markedWords = "请等待其他检查者完成复核质疑"
							} else {
								markedWords = "请等待负责人提交"
							}
						} else {
							markedWords = "请完成复核质疑"
						}
					}
				} else if (state == 4) {
					markedWords = "请等待被检查者完成整改"
				} else if (state == 5) {
					if (otherSubTaskList.length == 0) {
						if (this.judgeSubTaskItemState(ownSubTaskList,state)) {
							markedWords = "请完成复查"
						} else {
							markedWords = "请等待负责人提交"
						}
					} else {
						if (!this.judgeSubTaskItemState(ownSubTaskList,state)) {
							if (this.judgeSubTaskItemState(otherSubTaskList,state)) {
								markedWords = "请等待其他检查者完成复查"
							} else {
								markedWords = "请等待负责人提交"
							}
						} else {
							markedWords = "请完成复查"
						}
					}
				} else if (state == 6) {
					markedWords = "检查已完成"
				}
				return markedWords
			},
			
			// 是否允许质疑转换
			queryTransfer (index) {
			  switch(index) {
					case 0 :
					return '允许'
					break;
					case 1 :
					return '允许'
					break;
			  }
			},
			
			// 评价方式
			evaluationMethodTransfer (index) {
				 switch(index) {
					case 1 :
					return '打分'
					break;
			  }
			},
			// 根据主任务状态判断对应子任务检查项状态
			judgeCheckItemState (state) {
				let itemState;
				if (state == 1) {
					itemState = 1
				} else if (state == 2) {
					itemState = 1
				} else if (state == 3) {
					itemState = 3
				} else if (state == 4) {
					itemState = 4
				} else if (state == 5) {
					itemState = 5
				};
				return itemState		
			},
			
			// 判断子任务对应状态是否全部更改完成
			judgeSubTaskItemState (data,majorTaskState) {
				let temporaryFlag = false;
				for (let i = 0, len = data.length; i < len; i++) {
					for (let k = 0, len = data[i]['checkItems'].length; k < len; k++) {
						let temporaryData = data[i]['checkItems'];
						if ( majorTaskState == 2 || majorTaskState == 5 || this.judgeCheckItemState(majorTaskState) == 7) {
							temporaryFlag = temporaryData.some((item) => { return item['state'] == this.judgeCheckItemState(majorTaskState)})
						} else {
							if (majorTaskState == 4) {
								temporaryFlag = temporaryData.some((item) => { return item['state'] == this.judgeCheckItemState(majorTaskState) || item['state'] == 7})
							} else {
								temporaryFlag = temporaryData.some((item) => { return item['state'] != this.judgeCheckItemState(majorTaskState)})
							}
						};
						if (temporaryFlag) {
							return true
						} 
					}
				};
				return temporaryFlag
			},
			
			// 查询所有主任务
			getAllMainTasks(dataParams) {
				this.noDataShow = false;
				this.showLoadingHint = true;
				queryAllMainTasks(dataParams).then((res) => {
					this.showLoadingHint = false;
					this.statusContentList = [];
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					};
					if (res && res.data.code == 200) {
						if (res.data.data.list.length > 0) {
							this.noDataShow = false;
							for (let item of res.data.data.list) {
								this.statusContentList.push({
									status: item.state,
									serialNumber: item.number,
									examinationItem: item.hospatils[0]['name'],
									examinationTime: item.assess,
									examinationType: item.type,
									examinationPrincipal: item.persons[0]['name'],
									examinationStartTime: item.startTime,
									assessmentFormat: item.mode,
									isQuery: item.question,
									fullMark: item.score,
									id: item.id,
									persons: item.persons,
									remark: item.remarks,
									subTaskList: item.subTaskList
								})
							};
							console.log('处理数据',this.statusContentList);
						} else {
							this.noDataShow = true
						}
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
							type: 'warning'
						});
						this.showLoadingHint = false;
						this.noDataShow = true
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'error'
					});
					this.showLoadingHint = false;
					this.noDataShow = true;
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					}
				})
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
				let data = {
					hospitals : this.proId, //检查项目(指的是医院)
					mode : 1, //评价方式
					type : 1, //任务类型
					persons : this.workerId, //任务负责人
					subPersons : "", //子任务负责人
					startTime: "",//检查时间
					createTime : "", //创建时间
					state : this.current, //主任务状态
					page : 1, //页码
					limit : 20 //条数
				};
				if (index == 2) {
					data.state = 6
				};
				if (index == 1) {
					data.state = -1
				};
				this.getAllMainTasks(data)
			},
			// 任务状态下拉事件
			statusChange (val) {
				this.goingState = val.index;
				let data = {
					hospitals : this.proId, //检查项目(指的是医院)
					mode : 1, //评价方式
					type : 1, //任务类型
					persons : this.workerId, //任务负责人
					subPersons : "", //子任务负责人
					startTime: "",//检查时间
					createTime : "", //创建时间
					state : this.goingState, //主任务状态
					page : 1, //页码
					limit : 20 //条数
				};
				if (val.index == 0) {
					data.state = -1
				};
				this.getAllMainTasks(data)
			},
			// 进入任务
			enterTask (item,index) {
				// if (item.status === 0) {
				// 	return
				// };
				this.changeMainTaskId(item.id);
				uni.redirectTo({
					url: '/qualityPackage/pages/examineDetails/examineDetails'
				});
			},
		
			// 查看更多
			viewMore (item,index) {
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
		.empty-info {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto
		};
		.nav {
			width: 100%
		}
		.tabs-title {
		}
		.status-select-wrapper {
			width: 90%;
			padding: 8px 0;
			margin: 0 auto;
			display: flex;
			flex-flow: row;
			justify-content: center;
			> view {
				height: 40px;
				&:first-child {
					width: 20%;
					text-align: center;
					line-height: 40px;
					font-weight: bold
				};
				&:last-child {
					width: 80%;
					.show-box {
						height: 40px
					}
				}
			}
		}
		.status-content-wrapper {
			width: 96%;
			margin: 0 auto;
			flex: 1;
			overflow: auto;
			.statusStyle {
				margin-top: 6px
			}
			.status-content-list {
				padding: 8px;
				margin-bottom: 10px;
				background: #fff;
				position: relative;
				&:last-child {
					margin-bottom: 0
				};
				.status-info {
					width: 50%;
					padding-left: 4px;
					box-sizing: border-box;
					border-left: 1px solid #ddd;
					border-bottom: 1px solid #ddd;
					text-align: center;
					height: 30px;
					line-height: 30px;
					position: absolute;
					top: 0;
					right: 0;
					color: #2c9af1;
					font-size: 13px;
					overflow: hidden;
					> text {
						width: 100%;
						display: inline-block
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
				}
				.status-content-top {
					color: #2c9af1;
					font-size: 15px;
					.specific-status {
						
					}
				};
				.status-content-middle {
					margin: 5px 0 10px 0;
					> view {
						height: 25px;
						line-height: 25px;
						overflow: auto;
						text {
							&:first-child {
								margin-right: 6px
							};
							&:last-child {
								font-weight: bold
							}
						}
					}
					.content-remark {
						height: auto;
						text {
							display: inline-block;
							&:first-child {
								width: 12%;
								vertical-align: top
							};
							&:last-child {
								width: 85%;
								margin-right: 0;
								vertical-align: top
							}
						}
					}
				};
				.status-content-bottom {
					height: 40px;
					width: 70%;
					margin: 0 auto;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.btnRightStyle {
						background: #e8e8e8;
						color: #666
					};
					text {
						width: 90px;
						height: 40px;
						border-radius: 4px;
						text-align: center;
						line-height: 40px;
						color: #fff;
						background: #5ab3ff;
						&:last-child {
							color: #666;
							background: #e8e8e8
						}
					}
				}
			}
		}
	}	
</style>