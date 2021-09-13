<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="检查项详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="score-box">
			<text>得分: </text>
			<text v-if="subtaskInfo.state == 0">未评价</text>
			<text v-if="subtaskInfo.itemMode == 2 && subtaskInfo.majorState != 3">不参评</text>
			<text v-if="(subtaskInfo.itemMode != 2 && subtaskInfo.state != 0) || subtaskInfo.majorState == 3">{{`${subtaskInfo.score}/${subtaskInfo.fullScore}`}}</text>
		</view>
		<view class="operite-btn-box" v-if="subtaskInfo.majorState == 1 || subtaskInfo.majorState == 0">
			<view @click="gradeEvent(1)" v-if="fullScoreShow">满分</view>
			<view @click="gradeEvent(2)" v-if="deductMarkShow">扣分</view>
			<view @click="gradeEvent(0)" v-if="notMarkShow">不参评</view>
		</view>
		<view class="operite-query-btn-box" v-if="subtaskInfo.majorState == 3">
			<view @click="gradeEvent(-1)">重新评价</view>
			<view @click="gradeEvent(5)">驳回</view>
		</view>
		<view class="operite-query-btn-box" v-if="subtaskInfo.majorState == 5">
			<view @click="gradeEvent(8)">通过</view>
			<view @click="gradeEvent(7)">不通过</view>
		</view>
		<view class="examine-content-box">
			<view class="examine-items-number">
				<text>检查项编号: </text>
				<text>{{subtaskInfo.number}}</text>
			</view>
			<view class="score">
				<text>分数: </text>
				<text>{{subtaskInfo.score}}</text>
			</view>
			<view class="examine-describe">
				<text>检查描述: </text>
				<text>{{subtaskInfo.describe}}</text>
			</view>
			<view class="examine-describe">
				<text>标准参考: </text>
				<text>{{subtaskInfo.standard}}</text>
			</view>
			<view class="examine-describe">
				<text>考核内容: </text>
				<text>{{subtaskInfo.content}}</text>
			</view>
		</view>
		<view class="btn-box">
			<text @click="enterRecord" :class="{'btnRightStyle': !this.subtaskInfo['taskItemId']}">检查记录</text>
			<text @click="backTo">返回</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		updateTaskItem
	} from '@/api/task.js'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				taskTypeText: '',
				fullScoreShow: true,
				deductMarkShow: true,
				notMarkShow: true,
				infoText: '',
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskInfo'
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
			console.log('属啥',this.subtaskInfo);
			this.judgeScoreWay();
			this.taskTypeText = this.titleText
		},

		methods: {
			...mapMutations([
				'changeSubtaskInfo'
			]),

			// 进入检查记录页
			enterRecord() {
				if (!this.subtaskInfo['taskItemId']) { return};
				uni.navigateTo({
					url: '/qualityPackage/pages/examineRecord/examineRecord'
				})
			},
			
			// 判断打分方式 
			judgeScoreWay () {
				if (this.subtaskInfo['itemMode'] == 1) {
					this.fullScoreShow = false;
					this.deductMarkShow = true;
					this.notMarkShow = true
				} else if (this.subtaskInfo['itemMode'] == 2) {
					this.fullScoreShow = true;
					this.deductMarkShow = true;
					this.notMarkShow = false
				} else if (this.subtaskInfo['itemMode'] == 3) {
					this.fullScoreShow = true;
					this.deductMarkShow = false;
					this.notMarkShow = true
				}
			},
			
			// 进入评分页
			gradeEvent(num) {
				let temporaryInfo = this.subtaskInfo;
				temporaryInfo['operation'] = num;
				this.changeSubtaskInfo(temporaryInfo);
				if (num == 5) {
					this.rejectTaskItem({
						score: this.subtaskInfo.score,  //得分
						describe: "问题描述:" + this.subtaskInfo.recordDesc,
						file: "",
						remarks: "备注:" + this.subtaskInfo.recordRemarks,
						majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
						state: 4,	     //检查项状态
						majorId: this.subtaskInfo.majorId,		//主任务id
						subId: this.subtaskInfo.subId,		//子任务id
						fullScore: this.subtaskInfo.fullScore,		//满分
						taskNum: this.subtaskInfo.taskNum,	//任务编号
						operator: "检查者",		//检查者（固定）
						itemId: this.subtaskInfo.checkId,			//检查项id
						taskItemId: this.subtaskInfo.taskItemId, //检查项id
						majorState: this.subtaskInfo.majorState,		//主任务当前状态
						worker: "项目经理",	
						operation: 5			//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
					})
				} else {
					uni.navigateTo({
						url: '/qualityPackage/pages/grade/grade'
					})
				}
			},
			
			// 检查项驳回操作
			rejectTaskItem (data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				updateTaskItem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.backTo();
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
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
			
			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/qualityPackage/pages/examineDetails/examineDetails'
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
	}

	;

	.container {
		@include content-wrapper;
		background: #f5f5f5;
		padding-bottom: 0;
		font-size: 14px;
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

		.score-box {
			width: 98%;
			margin: 0 auto;
			height: 100px;
			margin-top: 8px;
			font-size: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #fff;
			border-radius: 4px;

			text {
				&:first-child {
					margin-right: 10px
				}
			}
		}

		.operite-btn-box {
			height: 70px;
			display: flex;
			font-size: 16px;
			justify-content: center;
			align-items: center;

			>view {
				display: inline-block;
				width: 100px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				background: #fff;
				margin-right: 8px;

				&:last-child {
					margin-right: 0
				}
			}
		}

		.operite-query-btn-box {
			height: 70px;
			display: flex;
			font-size: 16px;
			justify-content: space-around;
			align-items: center;

			>view {
				display: inline-block;
				width: 140px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #fff;
				margin-right: 8px;

				&:first-child {
					background: #2c9af1;
				}

				&:last-child {
					margin-right: 0;
					background: red
				}
			}
		}

		.examine-content-box {
			flex: 1;
			width: 98%;
			margin: 0 auto;
			height: 100px;
			background: #fff;
			border-radius: 4px;
			padding: 6px;

			>view {
				line-height: 30px;
				height: 30px;
				overflow: auto;

				>text {
					&:first-child {
						margin-right: 4px
					}

					&:last-child {
						font-weight: bold
					}
				}
			}
		}

		.btn-box {
			height: 60px;
			width: 70%;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.btnRightStyle {
				background: #e8e8e8;
				color: #989898
			};
			text {
				width: 110px;
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
</style>
