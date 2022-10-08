<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="empty-info" v-if="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area">
			<image :src="statusBackgroundPng">
			<view class="top-name">
				<view class="top-image">
					<image :src="juddgeAvatarUrl()" @click="headPhotoClickEvent">
				</view>
				<view class="top-text">
					<text>
						上午好! {{userName}}
					</text>
				</view>
			</view>
			<view class="top-hospital">
				<image :src="buildingLogoPng" mode=""></image>
				<view class="select-box">
					<xfl-select 
						:list="hospitalList"
						:clearable="false"
						:initValue="userInfo.hospitalList.length > 1 ? selectHospitalList[0].value : userInfo.hospitalList[0]['hospitalName']"
						:showItemNum="8"
						 @change="hosipitalChange"
						placeholder = "请选择医院"
						:selectHideType="'hideAll'"
					>
					</xfl-select>
				</view>
			</view>
				<view class="tabs-title-wrapper">
					<view class="tabs-name">任务列表</view>
					<view class="tabs-title">
							<u-tabs :list="statusList" :is-scroll="false" font-size="35" active-color="#1864FF" inactive-color="#101010" bar-width="100" :current="current" @change="tabChange"></u-tabs>
					</view>
				</view>	
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
					:initValue="initValue"
					:selectHideType="'hideAll'"
				>
				</xfl-select>
			</view>
		</view>
		<view class="status-content-wrapper" :class="{'statusContentWrapperStyle': current != 1}">
			<view class="not-start" v-if="current === 0" :class="{'statusStyle':current != 1}">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-content-top">
						<view class="content-status-sign">
							<image :src="statusTransferImg(item.status)" alt=""></image>
						</view>
						<view class="specific-status" :class="{'noStartStyle': item.status == 0, 
								'checkIngStyle': item.status == 1,
								'confirmIngStyle': item.status == 2,
								'queryIngStyle': item.status == 3,
								'changIngStyle': item.status == 5 || item.status == 4,
								'completedStyle': item.status == 6
							}"
							>
							<text>{{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="status-content-middle-first-line">
							<view class="content-examination-item">
								<text>{{`${item.year}年${item.examinationTime}${item.checkName}${item.examinationType}检查`}}</text>
							</view>
						</view>
						<view class="status-content-middle-two-line">
							<view class="content-assessment-format">
								<text>编号 : </text>
								<text>{{item.serialNumber}}</text>
							</view>
						</view>
						<view class="status-content-middle-three-line">
							<view class="content-examination-principal">
								<text>检查负责人 : </text>
								<text>{{item.examinationPrincipal}}</text>
							</view>
						</view>
						<view class="status-content-middle-four-line">
							<view class="status-info">
								<text>检查状态 : </text>
								<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
							</view>
						</view>
						<view class="status-content-middle-five-line">
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="viewMore(item,index)">查看更多</text>
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
					</view>
				</view>
			</view>
			<view class="is-going" v-if="current === 1">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-content-top">
						<view class="content-status-sign">
							<image :src="statusTransferImg(item.status)" alt=""></image>
						</view>
						<view class="specific-status" :class="{'noStartStyle': item.status == 0, 
								'checkIngStyle': item.status == 1,
								'confirmIngStyle': item.status == 2,
								'queryIngStyle': item.status == 3,
								'changIngStyle': item.status == 5 || item.status == 4,
								'completedStyle': item.status == 6
							}">
							<text>{{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="status-content-middle-first-line">
							<view class="content-examination-item">
								<text>{{`${item.year}年${item.examinationTime}${item.checkName}${item.examinationType}检查`}}</text>
							</view>
						</view>
						<view class="status-content-middle-two-line">
							<view class="content-assessment-format">
								<text>编号 : </text>
								<text>{{item.serialNumber}}</text>
							</view>
						</view>
						<view class="status-content-middle-three-line">
							<view class="content-examination-principal">
								<text>检查负责人 : </text>
								<text>{{item.examinationPrincipal}}</text>
							</view>
						</view>
						<view class="status-content-middle-four-line">
							<view class="status-info">
								<text>检查状态 : </text>
								<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
							</view>
						</view>
						<view class="status-content-middle-five-line">
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="viewMore(item,index)">查看更多</text>
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
					</view>
				</view>
			</view>
			<view class="is-completed" v-if="current === 2" :class="{'statusStyle':current != 1}">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-content-top">
						<view class="content-status-sign">
							<image :src="statusTransferImg(item.status)" alt=""></image>
						</view>
						<view class="specific-status" :class="{'noStartStyle': item.status == 0, 
								'checkIngStyle': item.status == 1,
								'confirmIngStyle': item.status == 2,
								'queryIngStyle': item.status == 3,
								'changIngStyle': item.status == 5 || item.status == 4,
								'completedStyle': item.status == 6
							}">
							<text>{{statusTransfer(item.status)}}</text>
						</view>
					</view>
					<view class="status-content-middle">
						<view class="status-content-middle-first-line">
							<view class="content-examination-item">
								<text>{{`${item.year}年${item.examinationTime}${item.checkName}${item.examinationType}检查`}}</text>
							</view>
						</view>
						<view class="status-content-middle-two-line">
							<view class="content-assessment-format">
								<text>编号 : </text>
								<text>{{item.serialNumber}}</text>
							</view>
						</view>
						<view class="status-content-middle-three-line">
							<view class="content-examination-principal">
								<text>检查负责人 : </text>
								<text>{{item.examinationPrincipal}}</text>
							</view>
						</view>
						<view class="status-content-middle-four-line">
							<view class="status-info">
								<text>检查状态 : </text>
								<text :class="{'animate-center':statusInfoTransfer(item,item['subTaskList'],item.status).length > 10}">{{statusInfoTransfer(item,item['subTaskList'],item.status)}}</text>
							</view>
						</view>
						<view class="status-content-middle-five-line">
						</view>
					</view>
					<view class="status-content-bottom">
						<text @click="viewMore(item,index)">查看更多</text>
						<text @click="enterTask(item,index)" :class="{'btnRightStyle': item.status === 0}">进入任务</text>
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
				hospitalList: [],
				selectHomeHospitalList: [],
				temporaryIndex: {},
				taskTypeText: '',
				isFresh: false,
				noDataShow: false,
				showLoadingHint: false,
				statusList: [{name: '未开始'},{name: '进行中'},{name: '已完成'}],
				flowList: ['全部','检查中','确认结果中','复核质疑中','整改中','复查中'],
				initValue: '全部',
				current: 0,
				goingState: '',
				statusContentList: [],
				statusBackgroundPng: require("@/static/img/status-background.png"),
				queryPng: require("@/static/img/querying.png"),
				changPng: require("@/static/img/changing.png"),
				checkPng: require("@/static/img/checking.png"),
				confirmPng: require("@/static/img/confirm.png"),
				completedPng: require("@/static/img/completed.png"),
				buildingLogoPng: require("@/static/img/building-logo.png"),
				noStartPng: require("@/static/img/no-start.png")
			}
		},
		
		options: { styleIsolation: 'shared' },
		
		mounted () {
			let data = {
				hospitals : this.proId, //检查项目(指的是医院)
				mode : 1, //评价方式
				type : "", //任务类型
				person : this.workerId, //任务负责人
				subPersons : "", //子任务负责人
				startTime: "",//检查时间
				createTime : "", //创建时间
				state : 0, //主任务状态
			};
			if (this.isSkipDetails) {
				this.current = this.cacheIndex['current'];
				this.goingState = this.cacheIndex['selectIndex'];
				if (this.cacheIndex['isGoingTask']) {
					data.state = this.cacheIndex['selectIndex'] == 0 ? -1 : this.cacheIndex['selectIndex'];
					this.initValue = this.statusOtherTransfer(this.cacheIndex['selectIndex'])
				} else {
					data.state = this.cacheIndex['current'] == 2 ? 6 : this.cacheIndex['current']
				}
			} else {
				this.current = 1;
				data.state = -1
			};
			// 获取医院列表数据
			this.getHospitalListData();
			this.changeIsSkipDetails(false);
			this.getAllMainTasks(data)
		},
		
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			let data = {
				hospitals : this.proId, //检查项目(指的是医院)
				mode : 1, //评价方式
				type : "", //任务类型
				person : this.workerId, //任务负责人
				subPersons : "", //子任务负责人
				startTime: "",//检查时间
				createTime : "", //创建时间
				state : this.goingState //主任务状态
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
				'userInfo',
				'isSkipDetails',
				'cacheIndex',
				'selectHospitalList'
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
		
		onLoad(options) {
			this.taskTypeText = this.titleText
		},
		
		methods: {
			...mapMutations([
				'changeMainTaskId',
				'changeCacheIndex',
				'changeSelectHospitalList',
				'changeIsSkipDetails',
				'changeTaskMessage',
				'resetQualityState',
				'changeEnterTaskDetailsSource'
			]),
			
			
			// 判断头像
			juddgeAvatarUrl() {
				return '/static/img/default-person.png'
			},
			
			// 头像点击事件
			headPhotoClickEvent () {
				this.temporaryIndex = {};
				if (this.current == 0) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				} else if (this.current == 1) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = true;
					this.temporaryIndex.selectIndex = this.goingState;
				} else {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				};
				this.changeIsSkipDetails(true);
				this.changeCacheIndex(this.temporaryIndex);
				uni.redirectTo({
					url: '/pages/personInfo/personInfo'
				})
			},
			
			// 获取医院列表数据
			getHospitalListData () {
				this.hospitalList = [];
				for (let item of this.userInfo.hospitalList) {
					this.hospitalList.push({
						value: item.name,
						id: item.id
					})
				};
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
				let data = {
					hospitals : this.proId, //检查项目(指的是医院)
					mode : 1, //评价方式
					type : "", //任务类型
					person : this.workerId, //任务负责人
					subPersons : "", //子任务负责人
					startTime: "",//检查时间
					createTime : "", //创建时间
					state : this.current //主任务状态
				};
				if (index == 2) {
					data.state = 6
				};
				if (index == 1) {
					data.state = -1;
					this.initValue = '全部'
				};
				this.getAllMainTasks(data)
			},
			
			// 任务状态下拉事件
			statusChange (val) {
				this.goingState = val.index;
				let data = {
					hospitals : this.proId, //检查项目(指的是医院)
					mode : 1, //评价方式
					type : "", //任务类型
					person : this.workerId, //任务负责人
					subPersons : "", //子任务负责人
					startTime: "",//检查时间
					createTime : "", //创建时间
					state : this.goingState //主任务状态
				};
				if (val.index == 0) {
					data.state = -1
				};
				this.getAllMainTasks(data)
			},
			
			// 医院下拉框下拉选择确定事件
			hosipitalChange (val) {
				this.selectHomeHospitalList = [];
				this.selectHomeHospitalList.push(val.orignItem);
				this.changeSelectHospitalList(this.selectHomeHospitalList);
				setCache('selectHospitalList',this.selectHomeHospitalList);
				this.$store.dispatch('resetQualityState');
				let data = {
					hospitals : this.proId, //检查项目(指的是医院)
					mode : 1, //评价方式
					type : "", //任务类型
					person : this.workerId, //任务负责人
					subPersons : "", //子任务负责人
					startTime: "",//检查时间
					createTime : "", //创建时间
					state : this.goingState //主任务状态, //主任务状态
				};
				if (this.current == 1) {
					if (this.goingState == 0) {
						data.state = -1
					}
				} else if (this.current == 0) {
					data.state = 0
				} else if (this.current == 2) {
					data.state = 6
				};
				this.getAllMainTasks(data)
			},
			
			// 提取年份
			extractYear (year) {
				
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
			
			// 任务状态转换图片
			statusTransferImg (index) {
			  switch(index) {
					case 0 :
					return this.noStartPng
					break;
			    case 1 :
			    return this.checkPng
			    break;
			    case 2 :
			    return this.confirmPng
			    break;
			    case 3 :
			    return this.queryPng
			    break;
			    case 4 :
			    return this.changPng
					break;
					case 5 :
					return this.changPng
					break;
					case 6 :
					return this.completedPng
			    break;
			  }
			},
			
			// 下拉框状态转换
			statusOtherTransfer (index) {
			  switch(index) {
					case 0 :
					return '全部'
					break;
			    case 1 :
			    return '检查中'
			    break;
			    case 2 :
			    return '确认结果中'
			    break;
			    case 3 :
			    return '复核质疑中'
			    break;
			    case 4 :
			    return '整改中'
					break;
					case 5 :
					return '复查中'
					break
			  }
			},
			
			// 任务状态提示语转换
			statusInfoTransfer (item,itemSubTask,state) {
				let ownSubTaskList = itemSubTask.filter((innerItem) => { return innerItem['persons'].indexOf(innerItem['persons'].filter((k) => {return k.id == this.workerId})[0]) != -1});
				let otherSubTaskList = itemSubTask.filter((innerItem) => { return innerItem['persons'].indexOf(innerItem['persons'].filter((k) => {return k.id == this.workerId})[0]) == -1});
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
			
			//提取负责人
			extractPrincipal (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(item.name)
				};
				return temporaryData.join("、")
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
							if (this.goingState != 0 ) {
								this.goingState = res.data.data.list[0]['state']
							} else {
								this.goingState = 0
							};
							for (let item of res.data.data.list) {
								this.statusContentList.push({
									status: item.state,
									serialNumber: item.number,
									examinationItem: item.hospatils[0]['name'],
									examinationTime: item.assesName,
									examinationType: item.typeName,
									examinationPrincipal: this.extractPrincipal(item.persons),
									examinationStartTime: item.startTime,
									assessmentFormat: item.mode,
									companion: item.companion,
									checkName: item.checkName ? item.checkName : '',
									isQuery: item.question,
									fullMark: item.score,
									year: item.year,
									id: item.id,
									finishTime: item.finishTime,
									questionTime: item.questionTime,
									reformTime: item.reformTime,
									persons: item.persons,
									subPersons: item.subPersons,
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
						this.showLoadingHint = false
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'error'
					});
					this.showLoadingHint = false;
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					}
				})
			},
	
			// 进入任务
			enterTask (item,index) {
				// if (item.status === 0) {
				// 	return
				// };
				this.temporaryIndex = {};
				if (this.current == 0) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				} else if (this.current == 1) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = true;
					this.temporaryIndex.selectIndex = this.goingState;
				} else {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				};
				this.changeIsSkipDetails(true);
				this.changeCacheIndex(this.temporaryIndex);
				this.changeTaskMessage(item);
				this.changeMainTaskId(item.id);
				uni.redirectTo({
					url: '/qualityPackage/pages/examineDetails/examineDetails'
				})
			},
		
			// 查看更多
			viewMore (item,index) {
				this.temporaryIndex = {};
				if (this.current == 0) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				} else if (this.current == 1) {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = true;
					this.temporaryIndex.selectIndex = this.goingState;
				} else {
					this.temporaryIndex.current = this.current;
					this.temporaryIndex.isGoingTask = false
				};
				this.changeIsSkipDetails(true);
				this.changeEnterTaskDetailsSource('/qualityPackage/pages/qualityManagement/index/index');
				this.changeCacheIndex(this.temporaryIndex);
				this.changeTaskMessage(item);
				this.changeMainTaskId(item.id);
				uni.redirectTo({
					url: '/qualityPackage/pages/taskDetails/taskDetails'
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
		background: #fafafa;
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
		.top-area {
			height: 224px;
			position: relative;
			padding-top: 44px;
			background: #fafafa;
			width: 100%;
			>image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0
			};
			.top-name {
				width: 90%;
				margin: 0 auto;
				height: 40px;
				margin-top: 10px;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				.top-image {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 40px;
					height: 40px;
					border-radius: 50%;
					background: #fff;
					z-index: 1000;
					margin-right: 8px;
					image {
						vertical-align: middle;
						width: 35px;
						height: 35px
					}
				};
				.top-text {
					color: #fff;
					font-size: 12px;
					z-index: 1000
				}
			};
			.top-hospital {
				width: 90%;
				height: 40px;
				margin: 0 auto;
				margin-top: 4px;
				display: flex;
				align-items: center;
				flex-flow: row nowrap;
				> image {
					width: 22px;
					height: 22px;
					z-index: 1
				};
				.select-box {
					flex: 1;
					/deep/ .show-box {
						background: transparent !important;
						border: none !important;
						color: #fff !important;
						padding: 0 12% 0 1%;
						.placeholder {
							color: #fff !important
						}
						> span {
							color: #fff !important
						};
						.list-container {
							top: 0;
							.list {
								.item {
									color: black
								};
								.active {
									color: #01a6ff;
								}
							}
						}
					}
				}
			};
			.tabs-title-wrapper {
					position: absolute;
					top: 144px;
					border: 1px solid #f4f4f4;
					z-index: 10;
					left: 3%;
					background: #fff;
					width: 94%;
					border-radius: 10px;
				.tabs-name {
					height: 40px;
					line-height: 40px;
					text-align: center;
					color: black !important;
					@include bottom-border-1px(#c9c9c9);
				};
				/deep/ .tabs-title {
					.u-tabs {
						border-radius: 10px;
						box-shadow: 0px 15px 10px -15px #b0d2ff;
						.u-scroll-view {
							.u-tab-item {
								font-size: 15px !important;
								color: black !important;
							}
						}
					}
				}
			}	
		}
		.status-select-wrapper {
			width: 90%;
			margin: 0 auto;
			background: #fafafa;
			margin-top: 2px;
			font-size: 13px;
			display: flex;
			flex-flow: row;
			justify-content: center;
			> view {
				height: 40px;
				&:first-child {
					text-align: left;
					line-height: 40px;
					color: #a8a8a8
				};
				&:last-child {
					flex: 1;
					/deep/ .show-box {
						height: 40px;
						border: none;
						padding: 0 12% 0 2% !important;
						background: #f9f9f9;
						.list-container {
							top: 0;
							.list {
								.item {
									color: #a8a8a8
								};
								.active {
									color: #01a6ff;
								}
							}
						};
						/deep/ .iconfont {
							color: #a8a8a8 !important
						}
					}
				}
			}
		}
		.statusContentWrapperStyle {
			margin-top: 20px;
		};
		.status-content-wrapper {
			width: 100%;
			background: #fafafa;
			flex: 1;
			overflow: auto;
			.statusStyle {
				margin-top: 6px
			}
			.status-content-list {
				width: 96%;
				margin: 0 auto;
				padding-bottom: 10px;
				box-sizing: border-box;
				margin-bottom: 10px;
				box-shadow: 0px 1px 3px 0 rgba(0,0,0,.23);
				border-radius: 8px;
				background: #fff;
				position: relative;
				.status-content-top {
					height: 30px;
					position: relative;
					padding: 0 10px;
					color: #43c3f4;
					font-size: 15px;
					.content-status-sign {
						position: absolute;
						top: 0;
						left: 10px;
						width: 22px;
						height: 22px;
						>image {
							width: 100%;
							height: 100%
						}
					}
					.specific-status {
						position: absolute;
						top: 0;
						right: 10px;
						max-width: 150px;
						font-size: 12px;
						text-align: center;
						height: 30px;
						line-height: 30px;
						margin-top: 11px;
						padding: 0 4px;
						box-sizing: border-box;
						background: #fff;
						border-radius: 10px;
						overflow-x: auto;
						white-space: nowrap
					};
					.noStartStyle {
						color: #E8CB51 !important
					};
					.checkIngStyle {
						color: #289E8E !important
					};
					.changIngStyle {
						color: #E86F50 !important
					};
					.queryIngStyle {
						color: #174E97 !important
					};
					.confirmIngStyle {
						color: #F2A15F !important
					};
					.completedStyle {
						color: #254550 !important
					}
				};
				.status-content-middle {
					padding: 10px;
					font-size: 16px;
					.status-content-middle-first-line {
						.content-examination-item {
							width: 100%;
							line-height: 25px;
							word-break: break-all;
							>text {
								color: #101010;
								font-weight: bold;
							}
						}
					};
					.status-content-middle-two-line {
						.content-assessment-format {
							width: 100%;
							line-height: 25px;
							margin: 4px 0;
							word-break: break-all;
							font-size: 14px;
							>text {
								color: #9E9E9A
							}
						}
					};
					.status-content-middle-three-line {
						.content-examination-principal {
							width: 100%;
							line-height: 25px;
							word-break: break-all;
							font-size: 14px;
							>text {
								color: #9E9E9A
							}
						}
					};
					.status-content-middle-four-line {
						display: inline-block;
						margin-top: 5px;
						> view {
							max-width: 100%;
							background: #dae6ff;
							border-radius: 20px;
							padding: 0 10px;
							box-sizing: border-box;
							text-align: left;
							height: 23px;
							line-height: 23px;
							font-size: 12px;
							// overflow: hidden;
							> text {
								display: inline-block;
								color: #0455ff;
							}
							// .animate-center {
							// 	white-space: nowrap;
							// 	animation: 4s wordsLoop linear infinite normal
							// }
							// @keyframes wordsLoop {
							// 	0% {
							// 		transform: translateX(100%)
							// 	}
							// 	100% {
							// 		transform: translateX(-100%)
							// 	}
							// }
						}
					};
					.status-content-middle-five-line {
						margin-top: 10px;
						@include bottom-border-1px(rgba(0, 0, 0, 0.23));
					}
				};
				.status-content-bottom {
					padding: 0 10px;
					box-sizing: border-box;
					height: 40px;
					width: 100%;
					margin: 0 auto;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.btnRightStyle {
						background: #e8e8e8 !important;
						color: #666 !important
					};
					text {
						font-size: 14px;
						width: 90px;
						height: 30px;
						border-radius: 20px;
						text-align: center;
						line-height: 30px;
						color: #fff;
						&:first-child {
							margin-right: 10px;
							background: #fff;
							color: #2d72ff;
							border: 1px solid #2d72ff;
						};
						&:last-child {
							color: #fff;
							background: #1864ff
						}
					}
				}
			}
		}
	}	
</style>