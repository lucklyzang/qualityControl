<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="nav">
			<nav-bar backState="3000" :home="false" bgColor="none" fontColor="#FFF" :title="taskTypeText" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="image-wrapper">
			<image :src="statusBackgroundPng"></image>
		</view>
		<view class="content">
			<view class="score" v-show="isShowInput">
				<view class="left">
					<text>{{`得分 (满分${subtaskInfo.fullScore})`}}</text>
				</view>
				<view class="right">
					<u-input v-model="gradeValue" placeholder="请输入分数" :disabled="isDisabled" type="number" :border="true" />
				</view>
			</view>
			<view class="problem-describe" v-show="subtaskInfo.operation == 2" :class="{'problemDescribeStyle': subtaskInfo.operation == 2}">
				<view class="problem-describe-top">
					<view class="problem-describe-top-left">
						<text>问题描述</text>
					</view>
					<view class="problem-describe-top-center">
						<text>扣分</text>
					</view>	
					<view class="problem-describe-top-right">
						<text>操作</text>
					</view>
				</view>	
				<view class="problem-describe-list" v-for="(item,index) in problemDescribeList" :key="index">
					<view class="problem-describe-left">
						<textarea :value="item.problemDescribeValue" placeholder="请输入问题描述" @input="(value) => issueDescribeChange(value,index)" />
					</view>
					<view class="problem-describe-center">
						<input :value="item.deductMarksvalue" @input="(value) => buckleScoreChange(value,index)" placeholder="分数" type="number" />
					</view>	
					<view class="problem-describe-right">
						<fa-icon type="plus-circle" size="26" color="#1864FF" @click="operateHandle('plus',item,index)"></fa-icon>
						<fa-icon v-show="index != 0" type="minus-circle" size="26" color="#1864FF"  @click="operateHandle('minus',item,index)"></fa-icon>
					</view>
				</view>	
			</view>
			<view class="problem-photo" v-show="subtaskInfo.operation == 2 || subtaskInfo.operation == 7 || subtaskInfo.operation == 5 || subtaskInfo.operation == -1">
				<view> 
					<text>{{subtaskInfo.operation == 2 ? '问题拍照' : '拍照'}}</text>
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
					<text>备注 </text>
				</view>
				<view class="bottom">
					<u-input v-model="remark" placeholder="请输入备注" type="textarea" :border="true"  />
				</view>
			</view>
		</view>
		<view class="btn-box-wrapper">
			<view class="btn-box" @click="sure">
				提交
			</view>
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
		submitTotalTaskDetails,
		getAliyunSign
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
				gradeValue: '0',
				infoText: '',
				isShowInput: true,
				problemDescribeValue: '',
				statusBackgroundPng: require("@/static/img/status-background.png"),
				problemDescribeList: [
					{
						problemDescribeValue: '',
						deductMarksvalue: ''
					}
				],
				taskTypeText: '',
				content: '',
				remark: '',
				isDisabled: false,
				showLoadingHint: false,
				sureCancelShow: false,
				imgIndex: '',
				isExpire: false,
				imgArr: [],
				temporaryImgPathArr: [],
				imgOnlinePathArr: []
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskInfo',
				'subtaskDetails',
				'disposeSubTaskData',
				'mainTaskId',
				'selectHospitalList',
				'timeMessage',
				'ossMessage',
				'enterGradeSource'
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
			console.log('跳转源',this.enterGradeSource);
			this.judgeScoreWay();
			this.taskTypeText = this.titleText
		},
		
		methods: {
			...mapMutations([
				'changeSubtaskInfo',
				'changeIsSkipDetails',
				'changeCacheIndex',
				'changeTimeMessage',
				'changeOssMessage',
				'changeIsShowRevaluationBtn',
				'changeIsShowRejectBtn'
			]),
			
			// 操作按钮事件
			operateHandle (operate,item,index) {
				if (operate === 'plus') {
					if (this.problemDescribeList.length == 5) {return};
					this.$set(this.problemDescribeList, this.problemDescribeList.length , {
							problemDescribeValue: '',
							deductMarksvalue: ''
						})
				} else {
					if (this.problemDescribeList[index]['deductMarksvalue'] != '') {
						this.gradeValue = this.gradeValue + Number(this.problemDescribeList[index]['deductMarksvalue'])
					};
					this.problemDescribeList.splice(index,1);
				}
			},
			
			// 扣分项的值改变事件
			buckleScoreChange (value,index) {
				this.$set(this.problemDescribeList[index], "deductMarksvalue" ,value.detail['value']);
				if(!(/(^[1-9]\d*$)/.test(value.detail['value'])) && value.detail['value'] != '') {
					this.$refs.uToast.show({
						title: '扣分应为正整数',
						type: 'warning'
					});
					this.$set(this.problemDescribeList[index], "deductMarksvalue" , null);
					this.gradeValue = this.subtaskInfo.fullScore - this.totalBuckleScore(this.problemDescribeList)
					return
				};
				if (this.totalBuckleScore(this.problemDescribeList) > this.subtaskInfo.fullScore) {
					this.$refs.uToast.show({
						title: '扣分总和不能大于该检查项分值',
						type: 'warning'
					});
					this.$set(this.problemDescribeList[index], "deductMarksvalue" ,"");
					this.gradeValue = this.subtaskInfo.fullScore - this.totalBuckleScore(this.problemDescribeList)
					return
				};
				this.gradeValue = this.subtaskInfo.fullScore - this.totalBuckleScore(this.problemDescribeList)
			},
			
			// 问题描述事件改变
			issueDescribeChange (value,index) {
				this.$set(this.problemDescribeList[index], "problemDescribeValue" ,value.detail['value']);
				console.log(this.problemDescribeList);
			},
			
			// 计算总扣分之和
			totalBuckleScore (targerArr) {
				return targerArr.reduce((total, currentValue, currentIndex, arr) => {
				        return total + Number(currentValue.deductMarksvalue);
				    }, 0);
			},
			
			// 获取阿里云签名接口
			getSign (filePath = '') {
				return new Promise((resolve, reject) => {
					getAliyunSign().then((res) => {
						if (res && res.data.code == 200) {
							// 存储签名信息
							this.changeOssMessage(res.data.data);
							let temporaryTimeInfo = {};
							temporaryTimeInfo['expire'] = Number(res.data.data.expire);
							// 存储过期时间信息
							this.changeTimeMessage(temporaryTimeInfo);
							if (this.isExpire) {
								this.uploadImageToOss(filePath)
							};
							this.isExpire = false;
							resolve()
						} else {
							this.$refs.uToast.show({
								title: `${res.data.data.msg}`,
								type: 'warning'
							});
							reject()
						}
					})
					.catch((err) => {
						this.$refs.uToast.show({
							title: `${err}`,
							type: 'warning'
						});
						reject()
					})
				})	
			},
			
			// 上传图片到阿里云服务器
			uploadImageToOss (filePath) {
				 return new Promise((resolve, reject) => {
					 // OSS地址
					 const aliyunServerURL = this.ossMessage.host;
					 // 存储路径(后台固定位置+随即数+文件格式)
					 const aliyunFileKey = this.ossMessage.dir + new Date().getTime() + Math.floor(Math.random() * 100) + filePath.substring(filePath.lastIndexOf('.'),filePath.length);
					 // 临时AccessKeyID0
					 const OSSAccessKeyId = this.ossMessage.accessid;
					 // 加密策略
					 const policy = this.ossMessage.policy;
					 // 签名
					 const signature = this.ossMessage.signature;
					 uni.uploadFile({
					 	url: aliyunServerURL,
					 	filePath: filePath,//要上传文件资源的路径
					 	name: 'file',//必须填file
					 	formData: {
					 		'key': aliyunFileKey,
					 		'policy': policy,
					 		'OSSAccessKeyId': OSSAccessKeyId,
					 		'signature': signature,
					 		'success_action_status': '200',
					 	},
					 	success: (res) => {
							if (res.statusCode == 200) {
								this.imgOnlinePathArr.push(`${aliyunServerURL}/${aliyunFileKey}`);
								resolve()
							} else if (res.statusCode == 403) { 
								// 后端签名过期后重新请求获取新的签名信息
								this.isExpire = true;
								this.getSign(filePath)
							} else {
								this.$refs.uToast.show({
									title: '上传图片失败',
									type: 'warning'
								});
								reject()
							}
					 	},
					 	fail: (err) => {
							this.$refs.uToast.show({
								title: `${err}`,
								type: 'warning'
							});
							reject()
					 	}
					})
				})
			},
			
			//提取子任务负责人(id)
			extractPrincipalId (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(item.id)
				};
				return temporaryData
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.imgArr.splice(this.imgIndex, 1);
				this.temporaryImgPathArr.splice(this.imgIndex, 1)
			},
			
			// 判断打分方式
			judgeScoreWay () {
				 this.subtaskInfo['recordRemarks'] ? this.remark = this.subtaskInfo['recordRemarks'].replace('备注:','') : this.remark = '';
				// 判断打分方式(1满分2扣分0不参评-1重新评价5驳回7不通过8通过);
				if (this.subtaskInfo['operation'] == 5 || this.subtaskInfo['operation'] == 7) {this.isShowInput = false};
				if (this.subtaskInfo['operation'] == 1) {
					this.isDisabled = true;
					this.gradeValue = this.subtaskInfo['fullScore'].toString();
				} else if (this.subtaskInfo['operation'] === 0) {
					this.isDisabled = true;
					this.gradeValue = '0'
				} else if (this.subtaskInfo['operation'] == 2 || this.subtaskInfo['operation'] == 5) {
					this.isDisabled = true;
					this.gradeValue = this.subtaskInfo['score'].toString();
					this.subtaskInfo['recordDesc'] ? this.problemDescribeValue = this.subtaskInfo['recordDesc'].replace('描述:','') : this.problemDescribeValue = ''
				} else if (this.subtaskInfo['operation'] == -1) {
					this.isDisabled = false;
					this.gradeValue = this.subtaskInfo['score'].toString();
					this.subtaskInfo['recordDesc'] ? this.problemDescribeValue = this.subtaskInfo['recordDesc'].replace('描述:','') : this.problemDescribeValue = ''
				} else if (this.subtaskInfo['operation'] == 7 || this.subtaskInfo['operation'] == 8) {
					this.isDisabled = true;
					this.gradeValue = this.subtaskInfo['score'].toString();
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
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						that.temporaryImgPathArr = that.temporaryImgPathArr.concat(res.tempFilePaths);
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
				addCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success'
						});
						// 此时检查项还没有生成id,不能查询检查项详情,此处手动更改评价方式
						let temporaryInfo = this.subtaskInfo;
						temporaryInfo['itemMode'] = 3;
						this.changeSubtaskInfo(temporaryInfo);
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
						title: `${err}`,
						type: 'warning'
					});
					this.showLoadingHint = false
				})
			},
			// 任务详情检查项操作（满分，扣分，不参评）
			updateCheckRecordMethod (data) {
				updateCheckRecord(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success'
						});
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
				updateTaskItem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success'
						});
						if (this.subtaskInfo['operation'] == 5) {
							this.changeIsShowRejectBtn(false)
						};
						if (this.subtaskInfo['operation'] == -1) {
							this.changeIsShowRevaluationBtn(false)
						};
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
						let temporaryIndex = {};
						temporaryIndex.current = 1;
						temporaryIndex.isGoingTask = true;
						temporaryIndex.selectIndex = 1;
						this.changeIsSkipDetails(true);
						this.changeCacheIndex(temporaryIndex);
						this.backToExaminePage()
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
			
			// 确认事件
			async sure () {
				if (this.subtaskDetails['mainTaskPerson'].indexOf(Number(this.workerId)) == -1 && this.extractPrincipalId(this.subtaskInfo['persons']).indexOf(Number(this.workerId)) == -1) {
					this.$refs.uToast.show({
						title: '你没有该子任务操作权限!',
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
					if (this.problemDescribeList.some((item,index) => {return item.deductMarksvalue == '' || item.deductMarksvalue == null})) {
						this.$refs.uToast.show({
							title: '扣分不能为0或空',
							type: 'warning'
						});
						return
					}
				};
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				// 判断操作方式
				if (this.subtaskInfo.operation === 0 || this.subtaskInfo.operation === 1 || this.subtaskInfo.operation === 2 ) {
					let temporaryProblemDescribeList = [];
					if (this.subtaskInfo.operation === 2) {
						for (let item of this.problemDescribeList) {
							temporaryProblemDescribeList.push({
								desc: item['problemDescribeValue'],
								score: item['deductMarksvalue']
							})
						}
					};
					let temporaryData = {
						score: this.gradeValue,
						describe: JSON.stringify(temporaryProblemDescribeList),
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
						majorState: this.subtaskInfo.majorState, //主任务当前状态
						worker: this.userName,
						additional: this.subtaskInfo.additional, //检查项类型
						mode: this.subtaskInfo.operation == 2 ? 3 : this.subtaskInfo.operation == 1 ? this.subtaskInfo.operation : 2, // 操作方式（1满分3扣分2不参评）
						operation: this.subtaskInfo.operation, //操作方式（1满分2扣分0不参评）
						imagePaths: [] //上传图片集合 imageList this.imgArr
					};
					// 上传图片到阿里云服务器
					if (this.temporaryImgPathArr.length > 0) {
						for (let imgI of this.temporaryImgPathArr) {
							if (Object.keys(this.timeMessage).length > 0) {
								// 判断签名信息是否过期
								if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
									await this.getSign();
									await this.uploadImageToOss(imgI)
								} else {
									await this.uploadImageToOss(imgI)
								}
							} else {
								await this.getSign();
								await this.uploadImageToOss(imgI)
							}
						};
						temporaryData['imagePaths'] = this.imgOnlinePathArr
					};
					if (this.subtaskInfo.operation != 2) {
						temporaryData.describe = ''
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
					// 驳回操作
					if (this.subtaskInfo.operation == 5) {
							let temporaryData = {
								score: "",  //得分
								describe: "",
								file: "",
								remarks: "备注:" + this.remark,
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
								imagePaths: [], //上传图片集合 imageList this.imgArr
								operation: 5			//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
							};
							// 上传图片到阿里云服务器
							if (this.temporaryImgPathArr.length > 0) {
								for (let imgI of this.temporaryImgPathArr) {
									if (Object.keys(this.timeMessage).length > 0) {
										// 判断签名信息是否过期
										if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
											await this.getSign();
											await this.uploadImageToOss(imgI)
										} else {
											await this.uploadImageToOss(imgI)
										}
									} else {
										await this.getSign();
										await this.uploadImageToOss(imgI)
									}
								};
								temporaryData['imagePaths'] = this.imgOnlinePathArr
							}
							this.updateTaskItemRecordMethod(temporaryData)
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
							additional: this.subtaskInfo.additional, //检查项类型	
							imagePaths: [], //上传图片集合 imageList this.imgArr
							operation: this.subtaskInfo.operation	//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
						};
						// 上传图片到阿里云服务器
						if (this.temporaryImgPathArr.length > 0) {
							for (let imgI of this.temporaryImgPathArr) {
								if (Object.keys(this.timeMessage).length > 0) {
									// 判断签名信息是否过期
									if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
										await this.getSign();
										await this.uploadImageToOss(imgI)
									} else {
										await this.uploadImageToOss(imgI)
									}
								} else {
									await this.getSign();
									await this.uploadImageToOss(imgI)
								}
							};
							temporaryData['imagePaths'] = this.imgOnlinePathArr
						};
						if (this.subtaskInfo.majorState == 3) {
							// 重新评价满分的情况
							if (this.gradeValue == this.subtaskInfo['fullScore']) {
								temporaryData['state'] = 6;
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
						};
						this.updateTaskItemRecordMethod(temporaryData)
					}
				}
			},
			
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: this.enterGradeSource
				})
			},
			
			// 返回任务详情页
			backToExaminePage() {
				uni.redirectTo({
					url: this.enterGradeSource
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
			position: fixed;
			width: 100%;
			height: 88px;
			top: 0;
			z-index: 10;
			left: 0
		}
		.image-wrapper {
			width: 100%;
			height: 240px;
			>image {
				width: 100%;
				height: 240px
			}
		};
		.content {
			flex: 1;
			padding: 6px 0 0 0;
			margin-top: -150px;
			box-sizing: border-box;
			overflow: auto;
			.score {
				padding: 12px 6px;
				background: #fff;
				@include bottom-border-1px(#9b9b9b);
				>view {
					display: inline-block
				};
				.left {
					vertical-align: middle;
					width: 30%;
					color: #101010;
					font-size: 16px;
					font-weight: bold
				};
				.right {
					width: 70%;
					vertical-align: middle;
					/deep/ .u-input--border {
						border: none;
						background: #f9f9f9
					}
				}
			};
			.problemDescribeStyle {
				@include bottom-border-1px(#9b9b9b);
			};
			.problem-describe {
				padding: 12px 6px;
				background: #fff;
				> view {
					width: 100%;
					display: flex;
					flex-flow: row nowrap;
				};
				.problem-describe-top {
					font-size: 14px;
					color: #101010;
					font-weight: bold;
					margin-bottom: 4px;
					.problem-describe-top-left {
						flex: 1;
						margin-right: 6px
					};
					.problem-describe-top-center {
						width: 70px;
						margin-right: 6px
					};
					.problem-describe-top-right {
						width: 100px;
						text-align: center
					}
				};
				.problem-describe-list {
					margin-bottom: 6px;
					&:last-child {
						margin-bottom: 0
					};
					.problem-describe-left {
						flex: 1;
						margin-right: 6px;
						textarea {
								width: 100%;
								padding: 2px;
								box-sizing: border-box;
								font-size: 14px;
						 		border: none;
						 		background: #f9f9f9;
								height: 45px;
								overflow: auto
						 	}
					};
					.problem-describe-center {
						width: 70px;
						margin-right: 6px;
						input {
							border: none;
							padding: 2px;
							box-sizing: border-box;
							font-size: 14px;
							background: #f9f9f9;
							height: 45px;
							overflow: auto
						}
					};
					.problem-describe-right {
						width: 100px;
						display: flex;
						justify-content: center;
						align-items: center;
						/deep/ .fa-plus-square {
							margin-right: 6px
						}
					}
				}
				// >view {
				// 	display: inline-block
				// };
				// padding: 8px 4px;
				// background: #fff;
				// .top {
				// 	width: 26%;
				// 	padding-left: 4px;
				// 	vertical-align: top;
				// 	color: #5d5d5d
				// };
				// .bottom {
				// 	width: 74%;
				// 	/deep/ .u-input--border {
				// 		border: none;
				// 		background: #f9f9f9
				// 	}
				// }
			};
			.remark-describe {
				padding: 8px 4px;
				background: #fff;
				margin-top: 6px;
				.top {
					width: 100%;
					height: 30px;
					font-weight: bold;
					line-height: 30px;
					color: #101010;
					font-size: 14PX;
					padding-left: 6px;
					box-sizing: border-box;
				};
				.bottom {
					width: 100%;
					/deep/ .u-input--border {
						border: none;
						background: #f9f9f9
					}
				}
			};
			.problem-photo {
				background: #fff;
				box-sizing: border-box;
				padding: 8px 0;
				>view {
					&:first-child {
						width: 100%;
						height: 30px;
						line-height: 30px;
						color: #101010;
						font-weight: bold;
						font-size: 14px;
						padding-left: 6px;
						box-sizing: border-box;
					};
					&:nth-child(2) {
						width: 100%;
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
		.btn-box-wrapper {
			width: 100%;
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn-box {
				height: 48px;
				width: 266px;
				font-size: 16px;
				margin: 0 auto;
				line-height: 48px;
				background: linear-gradient(to right, #6cd2f8, #2390fe);
				box-shadow: 0px 2px 6px 0 rgba(36,149,213,1);
				color: #fff;
				border-radius: 30px;
				font-weight: bold;
				text-align: center
			}
		}	
	}	
</style>



