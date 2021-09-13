<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="评分" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="content">
			<view class="score">
				<view class="left">
					<text>{{`得分 (满分${subtaskInfo.fullScore}) :`}}</text>
				</view>
				<view class="right">
					<u-input v-model="gradeValue" placeholder="" type="number" :border="true"  :disabled="isDisabled"/>
				</view>
			</view>
			<view class="problem-describe">
				<view class="top">
					<text>问题描述: </text>
				</view>
				<view>
					<u-input v-model="problemDescribeValue" placeholder="请输入问题描述" type="textarea" :border="true"  />
				</view>
			</view>
			<view class="problem-photo" v-show="this.subtaskInfo.operation == 2">
				<view>
					<text>问题拍照</text>
				</view>
				<view>
					<view v-for="(item, index) in imgArr" :key='index'>
						<image :src="item" mode="aspectFit"></image>
						<fa-icon type="window-close" size="20" color="#000000" @click="photoDelete(item,index)"></fa-icon>
					</view>
					<view>
						<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg"/>
					</view>
				</view>
			</view>
			<view class="remark-describe">
				<view class="top">
					<text>备注: </text>
				</view>
				<view>
					<u-input v-model="remark" placeholder="请输入备注" type="textarea" :border="true"  />
				</view>
			</view>
		</view>
		<view class="btn-box">
			<text @click="sure">确认</text>
			<text class="btn-right" @click="backTo">返回</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import Qs from 'qs'
	import {
		addCheckRecord,
		updateCheckRecord,
		updateTaskItem,
		submitTotalTaskDetails
	} from '@/api/task.js'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar,
			faIcon
		},
		data() {
			return {
				gradeValue: '',
				infoText: '',
				problemDescribeValue: '',
				taskTypeText: '',
				content: '',
				remark: '',
				isDisabled: false,
				showLoadingHint: false,
				sureCancelShow: false,
				imgIndex: '',
				imgArr: []
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskInfo',
				'disposeSubTaskData',
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
			this.judgeScoreWay();
			this.taskTypeText = this.titleText;
			console.log('缓存数据',this.subtaskInfo);
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo'
			]),
			// 弹框确定按钮
			sureCancel() {
				this.imgArr.splice(this.imgIndex, 1)
			},
			// 判断打分方式
			judgeScoreWay () {
				 this.subtaskInfo['recordDesc'] ? this.problemDescribeValue = this.subtaskInfo['recordDesc'].replace('描述:','') : this.problemDescribeValue = '';
				 this.subtaskInfo['recordRemarks'] ? this.remark = this.subtaskInfo['recordRemarks'].replace('备注:','') : this.remark = '';
				 // 判断打分方式(1满分2扣分0不参评-1重新评价7不通过8通过);
				if (this.subtaskInfo['operation'] == 1) {
					this.isDisabled = true;
					this.gradeValue = this.subtaskInfo['fullScore']
				} else if (this.subtaskInfo['operation'] === 0) {
					this.isDisabled = true;
					this.gradeValue = 0
				} else if (this.subtaskInfo['operation'] == 2 || this.subtaskInfo['operation'] == -1) {
					this.isDisabled = false;
					this.gradeValue = this.subtaskInfo['score']
				} else if (this.subtaskInfo['operation'] == 7 || this.subtaskInfo['operation'] == 8) {
					this.isDisabled = true;
					this.gradeValue = this.subtaskInfo['score'];
					this.problemDescribeValue = '';
					this.remark = ''
				}
			},
			// 弹框取消按钮
			cancelSure() {
			},
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			// 选择图片方法
			getImg() {
				var that = this
				uni.chooseImage({
					count: 3,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
								}
							})
						}
					}
				});
			},
			// 任务详情检查项操作（满分，扣分，不参评）
			addCheckRecordMethod (data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				addCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						if (this.subtaskInfo['majorState'] == 0) {
							// 判断该任务是否为第一次提交(是则更改主任务状态为检查中)
							if (!this.judgeSubTaskItemState(this.disposeSubTaskData,0)) {
								this.submitTotalTask({
									id : this.mainTaskId, // 主任务id
									modifyName : this.userName, // 修改人名称
									state : 1 // 主任务状态
								})
							} else {
								this.backToExaminePage()
							}
						} else {
							this.backToExaminePage()
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
			// 任务详情检查项操作（满分，扣分，不参评）
			updateCheckRecordMethod (data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				updateCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.backToExaminePage();
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
			updateTaskItemRecordMethod (data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				updateTaskItem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.backToExaminePage();
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
						this.backToExaminePage()
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
					})
				})
			},
			// 确认事件
			sure () {
				if (this.subtaskInfo['persons'].indexOf(this.subtaskInfo['persons'].filter((k) => {return k.id == this.workerId})[0]) == -1) {
					this.$refs.uToast.show({
						title: '该子任务为其它人负责，你无操作权限',
						type: 'warning'
					});
					return
				};
				if (this.gradeValue < 0) {
					this.$refs.uToast.show({
						title: '分数不能为负',
						type: 'warning'
					});
					return
				};
				if (this.gradeValue > this.subtaskInfo.fullScore) {
					this.$refs.uToast.show({
						title: '分数不能超过满分',
						type: 'warning'
					});
					return
				};
				if (this.subtaskInfo.operation == 2) {
					if (this.gradeValue == this.subtaskInfo.fullScore) {
						this.$refs.uToast.show({
							title: '扣分分数必须小于满分',
							type: 'warning'
						});
						return
					}
				};
				// 判断操作方式
				if (this.subtaskInfo.operation === 0 || this.subtaskInfo.operation === 1 || this.subtaskInfo.operation === 2 ) {
					let temporaryData = {
						score: this.gradeValue,
						describe: "问题描述:" + this.problemDescribeValue,
						file: "",
						remarks: "备注:" + this.remark,
						majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
						state: this.subtaskInfo.state,	     //检查项状态
						majorId: this.subtaskInfo.majorId,		//主任务id
						subId: this.subtaskInfo.subId,		//子任务id
						fullScore: this.subtaskInfo.fullScore,		//满分
						taskNum: this.subtaskInfo.taskNum,	//任务编号
						operator: "检查者",		//检查者（固定）
						itemId: this.subtaskInfo.checkId,			//检查项id
						taskItemId: this.subtaskInfo.taskItemId, //检查项id
						majorState: this.subtaskInfo.majorState,		//主任务当前状态
						worker: this.userName,
						mode: this.subtaskInfo.operation == 2 ? 3 : this.subtaskInfo.operation == 1 ? this.subtaskInfo.operation : 2, // 操作方式（1满分3扣分2不参评）
						operation: this.subtaskInfo.operation, //操作方式（1满分2扣分0不参评）
						imageList: this.imgArr //上传图片集合
					};
					// 判断检查项状态
					if (this.subtaskInfo.state === 0) {
						temporaryData['state'] = this.subtaskInfo.state + 1;
						delete temporaryData.taskItemId;
						this.addCheckRecordMethod(temporaryData)
					} else {
						this.updateCheckRecordMethod(temporaryData)
					}
				} else {
					let temporaryData = {
						score: this.gradeValue,  //得分
						describe: "问题描述:" + this.problemDescribeValue,
						file: "",
						remarks: "备注:" + this.remark,
						majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
						state: this.subtaskInfo.state,	     //检查项状态
						majorId: this.subtaskInfo.majorId,		//主任务id
						subId: this.subtaskInfo.subId,		//子任务id
						fullScore: this.subtaskInfo.fullScore,		//满分
						taskNum: this.subtaskInfo.taskNum,	//任务编号
						operator: "检查者",		//检查者（固定）
						itemId: this.subtaskInfo.checkId,			//检查项id
						taskItemId: this.subtaskInfo.taskItemId, //检查项id
						majorState: this.subtaskInfo.majorState,		//主任务当前状态
						worker: this.userName,	
						operation: this.subtaskInfo.operation	//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
					};
					if (this.subtaskInfo.majorState == 3) {
						// 重新评价满分的情况
						if (this.gradeValue == this.subtaskInfo['fullScore']) {
							temporaryData['state'] = 3;
							temporaryData['operation'] = 7
						} else {
							temporaryData['state'] = 4;
							temporaryData['operation'] = 7
						}
					} else if (this.subtaskInfo.majorState == 5) { 
						if (this.subtaskInfo.operation == 8) {
							temporaryData['state'] = 8
						} else if (this.subtaskInfo.operation == 7) {
							temporaryData['state'] = 7
						}
					}
					this.updateTaskItemRecordMethod(temporaryData)
				}
			},
			
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: '/qualityPackage/pages/examineItemDetails/examineItemDetails'
				})
			},
			
			// 返回任务详情页
			backToExaminePage() {
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
	};
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
		.content {
			flex: 1;
			padding: 6px 6px 0 6px;
			box-sizing: border-box;
			overflow: auto;
			.score {
				padding: 8px 4px;
				background: #fff;
				>view {
					display: inline-block
				};
				.left {
					vertical-align: middle;
					margin-right: 4px
				};
				.right {
					vertical-align: middle
				}
			};
			.problem-describe {
				padding: 8px 4px;
				margin: 6px 0;
				background: #fff;
				.top {
					margin-bottom: 4px
				}
			};
			.remark-describe {
				padding: 8px 4px;
				background: #fff;
				margin-top: 6px;
				.top {
					margin-bottom: 4px
				}
			};
			.problem-photo {
				background: #fff;
				box-sizing: border-box;
				padding: 8px 0;
				border-bottom: 12px solid #f6f6f6;
				>view {
					display: inline-block;
					&:first-child {
						width: 80px;
						vertical-align: top;
						height: 100px;
						padding-left: 4px;
						line-height: 100px;
					};
					&:nth-child(2) {
						width: calc(100% - 80px);
						font-size: 34px;
						>view {
							width: 32%;
							height: 100px;
							display: inline-block;
							vertical-align: top;
							margin-right: 2%;
							margin-top: 2%;
							position: relative;
							&:nth-child(1) {
								margin-top: 0;
							};
							&:nth-child(2) {
								margin-top: 0;
							};
							&:nth-child(3) {
								margin-top: 0;
							};
							&:nth-child(3n+3) {
								margin-right: 0;
							};
							> fa-icon {
								position: absolute;
								top: -12px;
								right: 0
							};
							image {
								width: 100%;
								height: 100%
							}
						}
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



