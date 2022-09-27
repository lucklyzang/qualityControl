<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<u-toast ref="uToast" />
		<u-modal v-model="enlargePhotoShow" width="90%" :zoom="false" :show-title="false" :mask-close-able="true">
			<view class="slot-content">
				<u-icon name="close-circle-fill" @click="closeImageEvent"></u-icon>
				<image :src="enlargeImg"></image>
			</view>
		</u-modal>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#4993f5" fontColor="#FFF" title="检查项详情" @backClick="backTo">
			</nav-bar>
		</view>
		<!-- <view class="score-box">
			<image src="/static/img/examine-item-background.png"></image>
			<view>
				<text>得分 </text>
				<text v-if="subtaskInfo.state == 0">未评价</text>
				<text v-if="subtaskInfo.itemMode == 2 && subtaskInfo.majorState != 3 && subtaskInfo.majorState != 6">不参评</text>
				<text v-if="subtaskInfo.itemMode == 2 && subtaskInfo.majorState == 6">已确认 不参评</text>
				<text v-if="(subtaskInfo.itemMode != 2 && subtaskInfo.state != 0) || subtaskInfo.majorState == 3">{{`${subtaskInfo.score}/${subtaskInfo.fullScore}`}}</text>
			</view>
		</view> -->
	<!-- 	<view class="operite-btn-box" v-if="subtaskInfo.majorState == 1 || subtaskInfo.majorState == 0">
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
		</view> -->
		<!-- <view class="operite-query-btn-box" v-if="subtaskInfo.majorState == 3">
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
		</view> -->
		<view class="examine-content-box">
			<view class="examine-content-title">
				<text>检查项详情</text>
			</view>
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
					<text>参考标准 : </text>
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
			<view class="examine-content-box-center-title">
				<text>其它建议</text>
			</view>
			<view class="examine-content-box-center">
				<view v-for="(item, index) in imgArr" :key='index'>
					<image :src="item" mode="aspectFit"></image>
					<fa-icon type="window-close" size="20" color="#000000" @click="photoDelete(item,index)"></fa-icon>
				</view>
				<view>
					<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg"/>
				</view>
			</view>
			<view class="examine-content-box-remark">
				<u-input v-model="otherSuggest" placeholder="请输入建议" type="textarea" :border="true"  />
				<view class="submit-box" @click="suggestEvent">
					<text>提交</text>
				</view>
			</view>
			<view class="suggestion-list-box">
				<view class="suggestion-list" v-for="(item,index) in suggestionList" :key="index">
					<view class="suggestion-date">
						<text>{{ item.startTime}}</text>
					</view>
					<view class="suggestion-image-list">
						<image :src="imgItem" v-for="(imgItem,imgIndex) in item.images"
								 @click="imageEvent(imgItem,imgIndex)":key="imgIndex"></image>
					</view>
					<view class="suggestion-content">{{ item.remark }}</view>
				</view>
			</view>	
			<view class="examine-content-box-check-details-title">
				<text>检查详情</text>
			</view>
			<view class="examine-content-box-check-details-box">
				<timeline>
					<timelineItem :leftTime="item.startTime" 
					:scrutator="item.scrutator" color="#43c3f4"
					:key="index"
					v-for="(item,index) in recordList"
					>
						<view class="tripItem">
							<view class="title" v-if="!Array.isArray(item.problemDescription)">{{item.problemDescription}}</view>
							<view class="title" v-else="Array.isArray(item.problemDescription)">
								<view v-for="(oneItem,oneIndex) in item.problemDescription" :key="oneIndex">
									{{`${oneIndex + 1}.描述: ${oneItem.desc}`}}
								</view>
							</view>
							<view class="record-img" v-if="item.images && item.images.length > 0">
								<view v-for="(innerItem,innerIndex) in item.images" :key="innerIndex"
								 @click="imageEvent(innerItem,innerIndex)"
								>
									<image :src="`${innerItem}`"  mode="aspectFill"></image>
								</view>
							</view>
							<view class="tips" v-if="item.remark">{{item.remark}}</view>
							<view class="file-down" v-if="item.files.length > 0">
								<view @click="downFileEvent(innerItem)" v-for="(innerItem,innerIndex) in item.files" :key="innerIndex">
									{{`${cutStr(innerItem)} 点击下载`}}
								</view>
							</view>
						</view>
					</timelineItem>
				</timeline>
			</view>
		</view>
		<view class="operta-box">
			<image :src="statusBackgroundPng"></image>
			<view class="btn-content" v-if="subtaskInfo.majorState == 1 || subtaskInfo.majorState == 0">
				<view>
					<view @click="gradeEvent(0)" :class="{'imgBoxImageStyle': subtaskInfo.itemMode == 2 }">
						<image src="/static/img/evaluated.png" v-if="subtaskInfo.itemMode == 2"></image>
						<image src="/static/img/no-evaluate.png" v-else></image>
					</view>
					<view class="text">不参评</view>
				</view>
				<view>
					<view @click="gradeEvent(1)" :class="{'imgBoxImageStyle': subtaskInfo.itemMode == 1 }">
						<image src="/static/img/full-marked.png" v-if="subtaskInfo.itemMode == 1"></image>
						<image src="/static/img/full-mark.png" v-else></image>
					</view>
					<view class="text">满分</view>
				</view>
				<view>
					<view @click="gradeEvent(2)" :class="{'imgBoxImageStyle': subtaskInfo.itemMode == 3 }">
						<image src="/static/img/deduct-marked.png" v-if="subtaskInfo.itemMode == 3"></image>
						<image src="/static/img/deduct-mark.png" v-else></image>
					</view>
					<view class="text">扣分</view>
				</view>
			</view>
			<view class="btn-content-query" v-if="subtaskInfo.majorState == 3">
				<view @click="gradeEvent(-1)">
					<image src="/static/img/again-evaluate.png"></image>
					<view class="text">重新评价</view>
				</view>
				<view @click="gradeEvent(5)">
					<image src="/static/img/reject.png"></image>
					<view class="text">驳回</view>
				</view>
			</view>
			<view class="btn-content-is-pass" v-if="subtaskInfo.majorState == 5">
				<view  @click="gradeEvent(7)">
					<image src="/static/img/no-pass.png"></image>
					<view class="text">不通过</view>
				</view>
				<view @click="gradeEvent(8)">
					<image src="/static/img/pass.png"></image>
					<view class="text">通过</view>
				</view>
			</view>
		</view>
	<!-- 	<view class="btn-box">
			<text @click="enterRecord" :class="{'btnRightStyle': !subtaskInfo['taskItemId']}">检查记录</text>
			<text @click="backTo">返回</text>
		</view> -->
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		queryItemDetails,
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
				taskTypeText: '',
				imgArr: [],
				recordList: [],
				suggestionList: [],
				statusBackgroundPng: require("@/static/img/status-background.png"),
				enlargePhotoShow: false,
				enlargeImg: '',
				content: '',
				otherSuggest: '',
				temporaryImgPathArr: [],
				imgOnlinePathArr: [],
				fullScoreShow: true,
				deductMarkShow: true,
				notMarkShow: true,
				rejectShow: true,
				infoText: '加载中',
				imgIndex: '',
				sureCancelShow: false,
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'subtaskInfo',
				'subtaskDetails',
				'selectHospitalList',
				'timeMessage',
				'ossMessage'
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
			this.judgeScoreWay();
			this.taskTypeText = this.titleText;
			this.getItemDetails(this.subtaskInfo['taskItemId']);
			console.log('撒',this.subtaskInfo['taskItemId']);
		},

		methods: {
			...mapMutations([
				'changeSubtaskInfo',
				'changeTimeMessage',
				'changeOssMessage'
			]),

			// 进入检查记录页
			enterRecord() {
				if (!this.subtaskInfo['taskItemId']) { return};
				uni.redirectTo({
					url: '/qualityPackage/pages/examineRecord/examineRecord'
				})
			},
			
			// 截取字符串
			cutStr (str) {
				let strIndex = str.indexOf('_');
				if (strIndex != -1) {
					return str.substr(strIndex + 1)
				};
				return str
			},
			
			// 判断字符串是否以指定字符开头和结尾
			confirmEnding (str, targetOne, targetTwo) {
				if(str.indexOf(targetOne) === 0 && str.lastIndexOf(targetTwo) === str.length - 1){
						return true
				};
			  return false
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.imgArr.splice(this.imgIndex, 1);
				this.temporaryImgPathArr.splice(this.imgIndex, 1)
			},
			
			// 图片放大事件
			imageEvent (item,index) {
				this.enlargePhotoShow = true;
				this.enlargeImg = `${item}`
			},
			
			// 弹框取消按钮
			cancelSure() {
			},
			
			// 图片关闭事件
			closeImageEvent () {
				this.enlargePhotoShow = false
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
			
			// 其它建议提交事件
			async suggestEvent () {
				this.showLoadingHint = true;
				this.infoText = '提交中';
				let temporaryData = {
					score: '',
					describe: '',
					file: "",
					remarks: this.otherSuggest,
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
					mode: '', // 操作方式（1满分3扣分2不参评）
					operation: '', //操作方式（1满分2扣分0不参评）
					type: 1,
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
				addCheckRecord(temporaryData).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.temporaryImgPathArr = [];
							this.otherSuggest = '';
							this.getItemDetails(this.subtaskInfo['taskItemId']);
							this.$refs.uToast.show({
								title: '提交成功',
								type: 'warning'
							});
						} else {
							this.$refs.uToast.show({
								title: `${res.data.data.msg}`,
								type: 'success'
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
			
			// 文件下载事件
			downFileEvent (file) {
				this.infoText = '下载中···';
				this.showLoadingHint = true;
				uni.downloadFile({
				  url: encodeURI(`${file}`), // 文件下载地址
				  success: response => {
				    if (response.statusCode === 200) {
				      uni.saveFile({
				        tempFilePath: response.tempFilePath,
				        success: (resData) => {
									this.showLoadingHint = false;
									this.$refs.uToast.show({
										title: '下载成功',
										type: 'success'
									});
									//保存成功并打开文件
									 uni.openDocument({
										filePath:resData.savedFilePath
									})
				        },
				        fail: error => {
									this.showLoadingHint = false;
				          this.$refs.uToast.show({
				          	title: `${error}`,
				          	type: 'warning'
				          })
				        }
				      })
				    }
				  }
				})
			},
			
			// 查询检查记录详情
			getItemDetails (checkId) {
				if (!checkId) { return };
				this.recordList = [];
				this.suggestionList = [];
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				queryItemDetails(checkId).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 200) {
						if (res.data.data.normal.length > 0) {
							for (let item of res.data.data.normal) {
								this.recordList.push({
									scrutator: item['operator'],
									startTime: item['operationTime'],
									problemDescription: item['describe'] ? this.confirmEnding(item['describe'],'[',']') ? JSON.parse(item['describe']) : item['describe'] : '',
									remark: item['remarks'],
									images: item['images'],
									files: item.hasOwnProperty('files') ? item['files'] : []
								})
							};
							for (let item of res.data.data.special) {
								this.suggestionList.push({
									scrutator: item['operator'],
									startTime: item['operationTime'],
									problemDescription: item['describe'] ? this.confirmEnding(item['describe'],'[',']') ? JSON.parse(item['describe']) : item['describe'] : '',
									remark: item['remarks'],
									images: item['images'],
									files: item.hasOwnProperty('files') ? item['files'] : []
								})
							}
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
			// gradeEvent(num) {
			// 	let temporaryInfo = this.subtaskInfo;
			// 	temporaryInfo['operation'] = num;
			// 	this.changeSubtaskInfo(temporaryInfo);
			// 	if (num == 5) {
			// 		// this.rejectTaskItem({
			// 		// 	score: this.subtaskInfo.score,  //得分
			// 		// 	describe: "问题描述:" + this.subtaskInfo.recordDesc,
			// 		// 	file: "",
			// 		// 	remarks: "备注:" + this.subtaskInfo.recordRemarks,
			// 		// 	majorSubId: this.subtaskInfo.majorSubId,  //主任务子任务关联id
			// 		// 	state: 4,	     //检查项状态
			// 		// 	majorId: this.subtaskInfo.majorId,		//主任务id
			// 		// 	subId: this.subtaskInfo.subId,		//子任务id
			// 		// 	fullScore: this.subtaskInfo.fullScore,		//满分
			// 		// 	taskNum: this.subtaskInfo.taskNum,	//任务编号
			// 		// 	operator: "检查者",		//检查者（固定）
			// 		// 	itemId: this.subtaskInfo.checkId,			//检查项id
			// 		// 	taskItemId: this.subtaskInfo.taskItemId, //检查项id
			// 		// 	majorState: this.subtaskInfo.majorState,		//主任务当前状态
			// 		// 	worker: "项目经理",	
			// 		// 	operation: 5			//操作方式（0-待评价, 1-待确认,2-已质疑,3-已复核,4-待整改,5-已整改,6-已确认,7-整改未通过,8-整改完成）		
			// 		// })
			// 		uni.redirectTo({
			// 			url: '/qualityPackage/pages/grade/grade'
			// 		})
			// 	} else {
			// 		uni.redirectTo({
			// 			url: '/qualityPackage/pages/grade/grade'
			// 		})
			// 	}
			// },
			
			// 评价事件
			gradeEvent(num) {
				let temporarySubtaskInfo = this.subtaskInfo;
				temporarySubtaskInfo['operation'] = num;
				this.changeSubtaskInfo(temporarySubtaskInfo);
				// 操作过的当前不总重复操作
				if (num == 0) {
					if (this.subtaskInfo.itemMode == 2) { return }
				};
				if (num == 1) {
					if (this.subtaskInfo.itemMode == 1) { return }
				};
				if (num == 2) {
					if (this.subtaskInfo.itemMode == 3) { return }
				};
				// -1: '重新评价'
				// 0: '不参评', 点击不跳转，直接提交
				// 1: '满分', 点击不跳转，直接提交
				// 2: '扣分',
				// 5: '驳回',
				// 7: '不通过'
				// 8: '通过', 点击不跳转，直接提交
				if (num == 0 || num == 1 || num == 8) {
					// 直接提交不跳转
					this.sure()
				} else {
					uni.navigateTo({
						url: '/qualityPackage/pages/grade/grade'
					})
				}
			},
			
			// 提交事件
			sure () {
				if (this.subtaskInfo['persons'].indexOf(this.subtaskInfo['persons'].filter((k) => {return k.id == this.workerId})[0]) == -1) {
					this.$refs.uToast.show({
						title: '该子任务为其它人负责，你无操作权限',
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
						this.addCheckRecordMethod(temporaryData)
					} else {
						this.updateCheckRecordMethod(temporaryData)
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
					this.updateTaskItemRecordMethod(temporaryData)
				}
			},
			
			// 任务详情检查项第一次操作（满分，扣分，不参评）
			addCheckRecordMethod (data) {
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
			updateCheckRecordMethod (data) {
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
				updateTaskItem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
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
					url: '/qualityPackage/pages/subtaskDetails/subtaskDetails'
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
		/deep/ .u-model {
			height: 600px;
			padding: 15px;
			position: relative;
			box-sizing: border-box;
			.u-model__content {
				.slot-content {
					height: 580px;
					u-icon {
						position: absolute;
						top: 0;
						right: 0;
						z-index: 100;
						font-size: 34px
					}
					image {
						width: 100%;
						height: 100%
					}
				}
			}
			.u-model__footer {
				display: none
			}
		};
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
			width: 100%;
			margin: 0 auto;
			flex: 1;
			background: #f5f5f5;
			border-radius: 4px;
			color: black;
			padding-bottom: 160px;
			box-sizing: border-box;
			font-size: 14px;
			.examine-content-title {
				padding-left: 8px;
				box-sizing: border-box;
				height: 40px;
				line-height: 40px
			}
			.examine-content-box-top {
				padding: 10px 8px 50px 8px;
				box-sizing: border-box;
				background: #fff;
				>view {
					height: auto;
					line-height: 30px;
					>text {
						&:first-child {
							margin-right: 6px
						}
					}
				}
			};
			.examine-content-box-center-title {
				padding-left: 8px;
				box-sizing: border-box;
				height: 40px;
				line-height: 40px
			}
			.examine-content-box-center {
				padding: 10px 8px 10px 8px;
				box-sizing: border-box;
				background: #fff;
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
			};
			.examine-content-box-remark {
				padding: 10px 8px 10px 8px;
				box-sizing: border-box;
				background: #fff;
				width: 100%;
				.submit-box {
					text-align: right;
					margin-top: 20px;
					>text {
						display: inline-block;
						font-size: 12px;
						color: #fff;
						background: #1864FF;
						width: 70px;
						border-radius: 4px;
						height: 25px;
						text-align: center;
						line-height: 25px
					}
				}
			};
			.suggestion-list-box {
				background: #fff;
				width: 100%;
				.suggestion-list {
					width: 94%;
					margin: 0 auto;
					margin-top: 10px;
					@include top-border-1px(#bebebe);
					.suggestion-date {
						line-height: 40px;
						height: 40px;
						color: black;
						font-size: 14px
					};
					.suggestion-image-list {
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						>image {
							width: 23.5%;
							margin-right: 2%;
							margin-bottom: 2%;
							height: 80px;
							&:nth-child(4n) {
								margin-right: 0
							}
						}
					};
					.suggestion-content {
						line-height: 30px;
						color: black;
						font-size: 16px;
						word-break: break-all
					};
					&:first-child {
						margin-top: 0
					}
				}
			}	
			.examine-content-box-check-details-title {
				padding-left: 8px;
				box-sizing: border-box;
				height: 40px;
				line-height: 40px
			};
			.examine-content-box-check-details-box {
				padding: 10px 8px 50px 8px;
				box-sizing: border-box;
				background: #fff;
				width: 100%;
				margin: 0 auto;
				overflow: auto;
				flex: 1;
				/deep/ .timeline {
					height: 100%;
					.timelineItem {
						.timeItem {
							.leftTime {
								padding: 0 !important;
								.time {
									padding: 0 4px;
									color: black;
									border-radius: 10px
								};
								.scrutator {
									color: #1864FF;
									padding: 0 10px;
									border: 1px solid #1864FF;
									margin-top: 4px;
									border-radius: 10px
								}
							};
							.line {
								margin: 0 10px;
								background: #1864FF !important;
								.out {
									background: #1864FF !important;
									.inner {
										background: #1864FF !important
									}
									width: 10px;
									height: 10px;
									.inner {
										width: 8px;
										height: 8px
									}
								}
							}
						}
					}
				};
				.tripItem {
						padding: 10px;
						box-sizing: border-box;
						margin-bottom: 30px;
						.title {
							font-size: 15px;
							font-weight: bold;
							color: block
						}
						.record-img {
							margin-top: 10px;
							 >view {
								display: inline-block;
								width: 50px;
								height: 50px;
								margin-right: 4px;
								margin-bottom: 4px;
								image {
									width: 100%;
									height: 100%
								}
							}
						}
						.tips {
							font-size:14px;
							font-weight:400;
							color:rgba(153,153,153,1);
							margin-top: 10px
						}
						.file-down {
							> view {
								margin-bottom: 8px;
								font-size: 16px;
								color: #1864FF;
								word-wrap:break-word;
								&:last-child {
									margin-bottom: 0
								}
							}
						}
				}
			}
		}
		.operta-box {
			width: 100%;
			height: 160px;
			position: fixed;
			left: 0;
			bottom: 0;
			background: #5d76e8;
			>image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0
			};
			.btn-content {
				margin-top: -20px;
				display: flex;
				flex-direction: row nowrap;
				justify-content: center;
				align-items: center;
				>view {
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					display: flex;
					width: 85px;
					height: 100px;
					z-index: 1000;
					>view {
						&:first-child {
							width: 55px;
							height: 55px;
							background: #fff;
							border: 1px solid #ebebeb;
							z-index: 100;
							border-radius: 50%;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 25px;
								height: 25px
							}
						};
						&:last-child {
							font-size: 14px;
							color: #fff
						}
					};
					.imgBoxImageStyle {
						background: #1864ff !important;
						border: none !important
					};
					&:nth-child(2) {
						transform: translateY(-20%)
					}
				}
			};
			.btn-content-query {
				margin-top: -20px;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				>view {
					width: 90px;
					height: 100px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					transform: translateY(-20%);
					>image {
						width: 65px;
						height: 65px
					};
					>view {
						z-index: 1000;
						font-size: 14px;
						color: #fff
					}
				}
			};
			.btn-content-is-pass {
				margin-top: -20px;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				>view {
					width: 90px;
					height: 100px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					transform: translateY(-20%);
					>image {
						width: 65px;
						height: 65px
					};
					>view {
						z-index: 1000;
						font-size: 14px;
						color: #fff
					}
				}
			}
		};
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
