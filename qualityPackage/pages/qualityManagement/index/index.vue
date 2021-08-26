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
						<text>请完成检查</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{item.status}}</text>
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
							<text>{{item.assessmentFormat}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{item.isQuery}}</text>
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
						<text @click="enterTask(item,index)">进入任务</text>
						<text @click="viewMore(item,index)">查看更多</text>
					</view>
				</view>
			</view>
			<view class="is-going" v-show="current === 1">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-info">
						<text>请完成检查</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{item.status}}</text>
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
							<text>{{item.assessmentFormat}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{item.isQuery}}</text>
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
						<text @click="enterTask(item,index)">进入任务</text>
						<text @click="viewMore(item,index)">查看更多</text>
					</view>
				</view>
			</view>
			<view class="is-completed" v-show="current === 2" :class="{'statusStyle':current != 1}">
				<view class="status-content-list" v-for="(item,index) in statusContentList" :key="index">
					<view class="status-info">
						<text>请完成检查</text>
					</view>
					<view class="status-content-top">
						<view class="specific-status">
							<text>状态 : {{item.status}}</text>
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
							<text>{{item.assessmentFormat}}</text>
						</view>
						<view class="content-isQuery">
							<text>质疑 : </text>
							<text>{{item.isQuery}}</text>
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
						<text @click="enterTask(item,index)">进入任务</text>
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
				current: 0,
				goingState: '',
				statusContentList: [
					{
						status: '检查中',
						serialNumber: '12121',
						examinationItem: '擦卓子',
						examinationTime: '2021年秋季',
						examinationType: 'QPE季度检查',
						examinationPrincipal: '站办公',
						examinationStartTime: '2021年4月12日',
						assessmentFormat: '打分',
						isQuery: '有',
						fullMark: 100,
						remark: '撒啊飒飒看来大家都撒啊飒飒看来大家都撒啊飒飒看来大家都撒啊飒飒看来大家都撒啊飒飒看来大家都'
					},
					{
						status: '请完成检查',
						serialNumber: '12121',
						examinationItem: '擦卓子',
						examinationTime: '2021年秋季',
						examinationType: 'QPE季度检查',
						examinationPrincipal: '站办公',
						examinationStartTime: '2021年4月12日',
						assessmentFormat: '打分',
						isQuery: '有',
						fullMark: 100,
						remark: '撒啊飒飒看来大家都'
					},
					{
						status: '请完成检查',
						serialNumber: '12121',
						examinationItem: '擦卓子',
						examinationTime: '2021年秋季',
						examinationType: 'QPE季度检查',
						examinationPrincipal: '站办公',
						examinationStartTime: '2021年4月12日',
						assessmentFormat: '打分',
						isQuery: '有',
						fullMark: 100,
						remark: '撒啊飒飒看来大家都'
					}
				]
			}
		},
		
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			let data = {};
			this.isFresh = true;
			if (this.current === 1) {
				this.getAllMainTasks(data,this.goingState)
			} else {
				this.getAllMainTasks(data,this.current)
			}
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
				'changeTitleText',
				'changeBottomBarIndex'
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
			    return '进行中'
			    break;
			    case 2 :
			    return '检查中'
			    break;
			    case 3 :
			    return '确认检查结果'
			    break;
			    case 4 :
			    return '复核质疑'
					break;
					case 5 :
					return '问题整改'
					break;
					case 6 :
					return '复查'
			    break;
			  }
			},
			
			// 是否质疑转换
			queryTransfer (index) {
			  switch(index) {
					case 0 :
					return '无'
					break;
					case 1 :
					return '有'
					break;
			  }
			},
			
			// 查询所有主任务
			getAllMainTasks(data,state) {
				this.noDataShow = false;
				this.showLoadingHint = true;
				queryAllMainTasks(data).then((res) => {
					this.showLoadingHint = false;
					this.statusContentList = [];
					let temporaryStatusContentList = [];
					temporaryStatusContentList = res.data.data.filter((item) => {return item['list']['state'] == state})
					if (this.isFresh) {
					  uni.stopPullDownRefresh();
					  this.isFresh = false
					};
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.noDataShow = false;
							for (let item of temporaryStatusContentList) {
								this.statusContentList.push({
									status: item.state,
									serialNumber: item.number,
									examinationItem: item.hospitals[0]['name'],
									examinationTime: item.assess,
									examinationType: item.type,
									examinationPrincipal: item.persons[0]['name'],
									examinationStartTime: item.startTime,
									assessmentFormat: item.mode,
									isQuery: item.question,
									fullMark: item.socre,
									remark: ''
								})
							}
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
						type: 'warning'
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
				let data = {};
				this.getAllMainTasks(data,this.current)
			},
			// 任务状态下拉事件
			statusChange (val) {
				this.goingState = val.index;
				let data = {};
				this.getAllMainTasks(data,this.goingState)
			},
			// 进入任务
			enterTask (item,index) {
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
					width: 80%
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
					border-left: 1px solid #ddd;
					border-bottom: 1px solid #ddd;
					text-align: center;
					height: 30px;
					line-height: 30px;
					position: absolute;
					top: 0;
					right: 0;
					color: #2c9af1;
					font-size: 13px
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
