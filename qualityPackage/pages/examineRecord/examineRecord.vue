<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<u-modal v-model="enlargePhotoShow" width="90%" :zoom="false" :show-title="false" :mask-close-able="true">
			<view class="slot-content">
				<u-icon name="close-circle-fill" @click="closeImageEvent"></u-icon>
				<image :src="enlargeImg"></image>
			</view>
		</u-modal>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#43c3f4" fontColor="#FFF" title="检查记录" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="back-btn-box">
			<view @click="backTo">返 回</view>
		</view>
		<view class="time-shaft">
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
						<view class="record-img" v-if="item.images.length > 0">
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
				taskTypeText: '',
				infoText: '',
				enlargeImg: '',
				recordList: [],
				showLoadingHint: false,
				enlargePhotoShow: false
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
			this.taskTypeText = this.titleText;
			this.getItemDetails(this.subtaskInfo['taskItemId']);
			console.log('啥数据',this.subtaskInfo);
		},
		
		methods: {
			...mapMutations([
			]),
			
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
			
			// 查询检查项详情
			getItemDetails (checkId) {
				this.recordList = [];
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				queryItemDetails(checkId).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.recordList.push({
									scrutator: item['operator'],
									startTime: item['operationTime'],
									problemDescription: this.confirmEnding(item['describe'],'[',']') ? JSON.parse(item['describe']) : item['describe'],
									remark: item['remarks'],
									images: item['images'],
									files: item.hasOwnProperty('files') ? item['files'] : []
								})
							};
							console.log('数据',this.recordList);
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
			
			// 图片放大事件
			imageEvent (item,index) {
				this.enlargePhotoShow = true;
				this.enlargeImg = `${item}`
			},
			
			// 图片关闭事件
			closeImageEvent () {
				this.enlargePhotoShow = false
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
			
			// 返回上一页
			backTo() {
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
		background: #fff;
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
		.back-btn-box {
			width: 96%;
			padding: 10px 0;
			font-szie: 16px;
			margin: 0 auto;
			> view {
				width: 120px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #fff;
				background-image: linear-gradient(to right, #37d5fc, #439bff);
			}
		}
		.time-shaft {
			width: 96%;
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
								background: #43c3f4;
								padding: 0 4px;
								color: #fff;
								border-radius: 10px
							}
						};
						.line {
							margin: 0 10px;
							.out {
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
					background: #ededed;
					box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
					border-radius:10px;
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
							color: blue;
							word-wrap:break-word;
							&:last-child {
								margin-bottom: 0
							}
						}
					}
			}
		}
	}	
</style>



