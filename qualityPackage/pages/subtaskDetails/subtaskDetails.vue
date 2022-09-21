<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#43c3f4" fontColor="#FFF" title="子任务详情" @backClick="backTo">
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
								<u-circle-progress :width="80" :border-width="10" active-color="#3e7dff" :percent="50">
								</u-circle-progress>
						</view>
						<view class="subtask-item-right-bottom">
							<text>检查已完成:</text>
							<text>60%</text>
						</view>
					</view>
				</view>
			</view>
			<view class="content-bottom-area">
				<view class="subtask-item-list" v-for="(itemInner,indexInner) in subtaskDetails.checkItem" :key="indexInner">
					<view class="subtask-item-name">
						{{itemInner.checkItemName.length == 0 ? '无标签' : itemInner.checkItemName}}
					</view>
					<view class="subtask-subitem-list" v-for="(checkItem,checkIndex) in itemInner.checkItemList" :key="checkIndex">
						<view class="subtask-subitem-top">
							<view class="subtask-subitem-top-left">
								<text>得分 : {{ `${checkItem.score}/${checkItem.fullScore}`}}</text>
							</view>
							<view class="subtask-subitem-top-right">
								<text>未评价</text>
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
								<u-icon name="arrow-right" color="#3175ff" size="30"></u-icon>
							</view>
							<view class="subtask-subitem-bottom-right">
								<view class="no-evaluate">
									<text>不参评</text>
								</view>
								<view class="deduct-mark">
									<text>扣分</text>
								</view>
								<view class="full-mark">
									<text>满分</text>
								</view>
							</view>
						</view>
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
		queryItemDetails
	} from '@/api/task.js'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import navBar from "@/components/zhouWei-navBar"
	import timeline from '@/components/chenbin-timeline/timeLine.vue'
	import timelineItem from '@/components/chenbin-timeline/timelineItem.vue'
	export default {
		components: {
			navBar,
			timeline,
			timelineItem
		},
		data() {
			return {
				infoText: '加载中',
				statusBackgroundPng: require("@/static/img/status-background.png"),
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskDetails',
				'permissionInfo',
				'taskMessage',
				'subtaskInfo',
				'permissionInfo',
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
				console.log(this.taskMessage)
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo'
			]),
	
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: '/qualityPackage/pages/examineDetails/examineDetails'
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
			
			// 检查项详情点击事件
			checkItemClickEvent (checkItem) {
				console.log('检查项详情',checkItem,this.subtaskDetails);
				// 判断是否为检查者
				if (!this.judgePermission(this.permissionInfo)) {
					this.$refs.uToast.show({
						title: '你没有此操作权限!',
						type: 'warning'
					});
					return
				};
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
			width: 100%
		};
		.content-top-area {
			position: relative;
			width: 100%;
			margin: 0 auto;
			z-index: 1000;
			height: 110px;
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
				top: 10px;
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
				box-shadow: 0px 15px 10px -15px #b0d2ff;
				&:last-child {
					margin-bottom: 0
				};
				.subtask-item-left {
					width: 70%;
					.subtask-item-title {
						margin-bottom: 6px;
						color: black;
						word-break: break-all;
						font-size: 16px;
					};
					.subtask-item-oerson {
						margin-bottom: 6px;
						word-break: break-all;
						color: #adada9;
						font-size: 14px;
						margin: 12px 0
					};
					.subtask-item-grade {
						font-size: 12px;
						width: 110px;
						padding: 0 6px;
						color: #3e7dff;
						border: 1px solid #3e7dff;
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
						text {
							font-size: 12px;
							&:first-child {
								color: #adada9
							};
							&:last-child {
								color: #3e7dff
							}
						}
					}
				}
			}	
		};
		.content-bottom-area {
			width: 96%;
			margin: 0 auto;
			margin-top: 10px;
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
					color: black;
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
						@include bottom-border-1px(#cecece);
						.subtask-subitem-top-left {
							color: black;
							font-size: 13px
						};
						.subtask-subitem-top-right {
							color: #518aff;
							font-weight: bold;
							font-size: 13px
						}
						
					};
					.subtask-subitem-center {
						padding: 0 12px;
						box-sizing: border-box;
						color: #b7b7b4;
						line-height: 20px;
						font-size: 12px;
						word-break: break-all;
						text-align: justify;
						margin: 4px 0;
						>text {
							&:first-child {
								color: black
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
								color: #3175ff;
								font-weight: bold;
								margin-right: 20px
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
								width: 1px solid #f5b47f !important; 
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
								width: 1px solid #ec886d !important;
								box-sizing: border-box !important;
								background: #fff !important
							}
							.full-mark {
								color: #fff;
								background: #289e8e
							};
							.fullMarkStyle {
								color: #289e8e !important;
								width: 1px solid #289e8e !important;
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





