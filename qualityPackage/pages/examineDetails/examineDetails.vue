<template>
	<view class="container">
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="检查详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="flow-wrapper">
			<u-steps :list="flowList" mode="number" active-color="#fa3534"></u-steps>
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
					<t-td align="left">{{ item.one }}</t-td>
					<t-td align="left">{{ item.two }}</t-td>
					<t-td align="left">{{ item.three }}</t-td>
					<t-td align="left">{{ item.four }}</t-td>
					<t-td align="left">{{ item.five }}</t-td>
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
							<view class="subtask-item-title">
								<text>
									<u-icon name="list"></u-icon>
								</text>
								<text>
									{{itemInner.checkItemName}}
								</text>
							</view>
							<view class="subtask-item-list" v-for="(checkItem,checkIndex) in itemInner.checkItemList" :key="checkIndex"
								@click="checkItemEvent(item,index)"
							>
								<view class="subtask-item-list-left">
									<text>
										{{checkItem.itemName}}
									</text>
								</view>
								<view class="subtask-item-list-right">
									<text>{{checkItem.status}}</text>
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
			<text class="btn-left" @click="submitResult">提交</text>
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
		querySingleMainTask
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
				tableList: [
					{
						id: 0,
						one: '2020.3.1',
						two: '2020.3.1',
						three: '2020.3.1',
						four: '100',
						five: '50'
					}
				],
				subtaskList: [
					{
						subtaskName: '保洁检查保洁检查保洁检查',
						subtaskScore: 40,
						subtaskFullMark: 100,
						subtaskPrincipal: '读书的',
						unfold: false,
						isScroll: true,
						checkItem: [
							{
								checkItemName: '日常管理',
								checkItemList: [
									{
										itemName: '飒飒飒飒是飒飒撒飒飒飒飒是飒飒撒飒飒飒飒是飒飒撒飒飒飒飒是飒飒撒飒飒飒飒是飒飒撒',
										status: '待评价'
									},
									{
										itemName: '飒飒',
										status: '已评价'
									},
									{
										itemName: '代课老师反馈',
										status: '待评价'
									}
								]
							},
							{
								checkItemName: '楼梯管理',
								checkItemList: [
									{
										itemName: '飒飒飒飒撒',
										status: '待评价'
									},
									{
										itemName: '飒飒飒飒撒',
										status: '已评价'
									},
									{
										itemName: '代课老师飒飒反馈',
										status: '待评价'
									}
								]
							}
						]
					},
					{
						subtaskName: '工具检查',
						subtaskScore: 40,
						subtaskFullMark: 100,
						subtaskPrincipal: '读书的',
						unfold: true,
						isScroll: false,
						checkItem: [
							{
								checkItemName: '日常管理',
								checkItemList: [
									{
										itemName: '飒飒飒飒是飒飒撒',
										status: '待评分'
									},
									{
										itemName: '飒飒',
										status: '已评分'
									},
									{
										itemName: '代课老师反馈',
										status: '已评分'
									}
								]
							},
							{
								checkItemName: '楼梯管理',
								checkItemList: [
									{
										itemName: '飒飒飒飒撒',
										status: '已评分'
									},
									{
										itemName: '飒飒飒飒撒',
										status: '已评分'
									},
									{
										itemName: '代课老师飒飒反馈',
										status: '已评分'
									}
								]
							}
						]
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'isToCallTaskPage',
				'userInfo',
				'isMedicalMan'
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
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/qualityPackage/pages/qualityManagement/index/index'
				})
			},
			// 子任务点击事件
			subtaskEvent (item,index) {
				this.subtaskList[index]['unfold'] = !item.unfold
			},
			// 检查项点击事件
			checkItemEvent (item,index) {
				uni.redirectTo({
					url: '/qualityPackage/pages/examineItemDetails/examineItemDetails'
				})
			},
			// 检查结果提交
			submitResult () {
				
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
			.btn-right {
				background: #e8e8e8;
				color: #989898
			}
		}
	}	
</style>

