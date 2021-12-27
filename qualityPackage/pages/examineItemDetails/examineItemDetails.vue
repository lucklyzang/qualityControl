<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#43c3f4" fontColor="#FFF" title="检查项详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="score-box">
			<image src="/static/img/examine-item-background.png"></image>
			<view>
				<text>得分 </text>
				<text v-if="subtaskInfo.state == 0">未评价</text>
				<text v-if="subtaskInfo.itemMode == 2 && subtaskInfo.majorState != 3 && subtaskInfo.majorState != 6">不参评</text>
				<text v-if="subtaskInfo.itemMode == 2 && subtaskInfo.majorState == 6">已确认 不参评</text>
				<text v-if="(subtaskInfo.itemMode != 2 && subtaskInfo.state != 0) || subtaskInfo.majorState == 3">{{`${subtaskInfo.score}/${subtaskInfo.fullScore}`}}</text>
			</view>
		</view>
		<view class="operite-btn-box" v-if="subtaskInfo.majorState == 1 || subtaskInfo.majorState == 0">
			<view @click="gradeEvent(1)" v-if="fullScoreShow">
				<view class="image-box">
					<image src="/static/img/full-mark.png"></image>
				</view>
				<view class="text">满分</view>
			</view>
			<view @click="gradeEvent(2)" v-if="deductMarkShow">
				<view class="image-box">
					<image src="/static/img/deduct-mark.png"></image>
				</view>
				<view class="text">扣分</view>
			</view>
			<view @click="gradeEvent(0)" v-if="notMarkShow">
				<view class="image-box">
					<image src="/static/img/no-evaluate.png"></image>
				</view>
				<view class="text">不参评</view>
			</view>
		</view>
		<view class="operite-query-btn-box" v-if="subtaskInfo.majorState == 3">
			<view @click="gradeEvent(-1)">
				<view class="image-box">
					<image src="/static/img/again-evaluate.png"></image>
				</view>
				<view class="text">重新评价</view>
			</view>
			<view @click="gradeEvent(5)">
				<view class="image-box">
					<image src="/static/img/reject.png"></image>
				</view>
				<view class="text">驳回</view>
			</view>
		</view>
		<view class="operite-query-btn-box" v-if="subtaskInfo.majorState == 5">
			<view @click="gradeEvent(8)">
				<view class="image-box">
					<image src="/static/img/pass.png"></image>
				</view>
				<view class="text">通过</view>
			</view>
			<view @click="gradeEvent(7)">
				<view class="image-box-two">
					<image src="/static/img/no-pass.png"></image>
				</view>
				<view class="text">不通过</view>
			</view>
		</view>
		<view class="examine-content-box">
			<view class="examine-content-box-top">
				<view class="examine-items-number">
					<text>检查项编号 : </text>
					<text>{{subtaskInfo.number}}</text>
				</view>
				<view class="score">
					<text>分 数 : </text>
					<text>{{subtaskInfo.fullScore}}</text>
				</view>
				<view class="examine-describe">
					<text>检查描述 : </text>
					<text>{{subtaskInfo.describe}}</text>
				</view>
				<view class="examine-describe">
					<text>标准参考 : </text>
					<text>{{subtaskInfo.standard}}</text>
				</view>
				<view class="examine-describe">
					<text>考核内容 : </text>
					<text>{{subtaskInfo.content}}</text>
				</view>
				<view class="examine-describe">
					<text>类型 : </text>
					<text>{{subtaskInfo.additional === 0 ? '普通' : '附加'}}</text>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<text @click="enterRecord" :class="{'btnRightStyle': !subtaskInfo['taskItemId']}">检查记录</text>
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
				rejectShow: true,
				infoText: '',
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskInfo',
				'selectHospitalList'
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
			this.judgeScoreWay();
			this.taskTypeText = this.titleText;
			console.log('撒',this.subtaskInfo);
		},

		methods: {
			...mapMutations([
				'changeSubtaskInfo'
			]),

			// 进入检查记录页
			enterRecord() {
				if (!this.subtaskInfo['taskItemId']) { return};
				uni.redirectTo({
					url: '/qualityPackage/pages/examineRecord/examineRecord'
				})
			},
			
			// 判断打分方式 
			judgeScoreWay () {
				if (this.subtaskInfo.majorState == 1 || this.subtaskInfo.majorState == 0) {
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
				} else if (this.subtaskInfo.majorState == 3) {
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
					uni.redirectTo({
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
						title: `${err}`,
						type: 'warning'
					});
					this.showLoadingHint = false
				})
			},
			
			// 返回上一页
			backTo() {
				uni.redirectTo({
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
			width: 100%;
			margin: 0 auto;
			margin-top: -3px;
			height: 160px;
			font-size: 30px;
			color: #fff;
			border-bottom-right-radius: 20px;
			border-bottom-left-radius: 20px;
			position: relative;
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%
			};
			> view {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 160px;
				display: flex;
				justify-content: center;
				align-items: center;
				text {
					&:first-child {
						margin-right: 10px;
						font-size: 20px
					}
				}
			}
		}

		.operite-btn-box {
			height: 75px;
			display: flex;
			font-size: 16px;
			justify-content: center;
			align-items: center;
			>view {
				display: flex;
				flex-direction: column;
				width: 80px;
				transform: translateY(-40%);
				justify-content: center;
				align-items: center;
				margin-right: 8px;
				> view {
					&:first-child {
						width: 80px;
						height: 80px;
						border-radius: 50%;
						image {
							width: 100%;
							height: 100%;
							border-radius: 50%
						}
					};
					&:last-child {
						color: #666
					}
				};
				&:last-child {
					margin-right: 0
				}
			}
		}

		.operite-query-btn-box {
			height: 80px;
			display: flex;
			font-size: 16px;
			justify-content: center;
			align-items: center;
			>view {
				display: flex;
				flex-direction: column;
				width: 80px;
				transform: translateY(-40%);
				justify-content: center;
				align-items: center;
				margin-right: 8px;
				> view {
					&:first-child {
						width: 80px;
						height: 80px;
						border-radius: 50%;
						image {
							width: 100%;
							height: 100%;
							border-radius: 50%
						}
					};
					&:last-child {
						margin-top: 6px;
						color: #666
					}
				};
				&:last-child {
					margin-right: 0;
					.image-box-two {
						width: 76px
					}
				}
			}
		}

		.examine-content-box {
			flex: 1;
			width: 100%;
			margin: 0 auto;
			height: 100px;
			background: #f5f5f5;
			border-radius: 4px;
			.examine-content-box-top {
				padding: 8px;
				background: #fff;
				>view {
					height: auto;
					line-height: 30px;
					>text {
						&:first-child {
							margin-right: 6px;
							color: #9a9a9a
						}
				
						&:last-child {
							font-weight: bold
						}
					}
				}
			}
		}

		.btn-box {
			height: 60px;
			width: 80%;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.btnRightStyle {
				background: #e8e8e8;
				color: #989898
			};
			text {
				width: 140px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #fff;
				background-image: linear-gradient(to right, #37d5fc , #439bff);
				&:last-child {
					color: #666;
					background: #e8e8e8
				}
			}
		}
	}
</style>
