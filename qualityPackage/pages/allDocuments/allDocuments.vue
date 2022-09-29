<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<u-modal v-model="enlargePhotoShow" width="100%" :zoom="false" :show-title="false" :mask-close-able="true">
			<view class="slot-content">
				<u-icon name="close-circle-fill" @click="closeImageEvent"></u-icon>
				<image :src="enlargeImg"></image>
			</view>
		</u-modal>
		<view class="empty-info" v-if="noDataShow">
			<u-empty text="暂无文件" mode="list"></u-empty>
		</view>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#4993f5" fontColor="#FFF" title="全部文件" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="content-top-area">
			<view class="content-top-left">
				<u-icon name="search" color="#e3e3e1" size="45"></u-icon>
				<u-input v-model="textValue" type="text" height="65" :border="true" :clearable="false" placeholder="在全部文件中搜索" />
			</view>
			<view class="content-top-right">
				<view class="search" @click="searchEvent">搜索</view>
			</view>
		</view>
		<view class="content-bottom-area">
			<view class="file-list" v-for="(item,index) in fileList" :key="index" @click="fileListEvent(item)">
				<view class="file-list-top">
					<text>
						{{ item.fileName }}
					</text>
				</view>
				<view class="file-list-bottom">
					<view class="left">
						{{ `上传者: ${item.uploadAuthor}` }}
					</view>
					<view class="right">
						{{ item.uploadDate }}
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
		getFiles
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
				textValue: '',
				fileList: [],
				noDataShow: false,
				enlargePhotoShow: false,
				enlargeImg: '',
				temporaryFileList: [],
				infoText: '加载中',
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'taskMessage',
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
			this.getFilesList();
			console.log(this.taskMessage)
		},
		
		methods: {
			...mapMutations([
			]),
			
			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/pages/personInfo/personInfo'
				})
			},
			
			// 图片关闭事件
			closeImageEvent () {
				this.enlargePhotoShow = false
			},
			
			// 文件点击事件
			fileListEvent (item) {
				// 判断是图片还是文件
				if (item.file.indexOf('.png') != -1 || item.file.indexOf('.jpg') != -1 || item.file.indexOf('.gif') != -1) {
					this.imageEvent(item.file)
				} else {
					this.downFileEvent(item.file)
				}
			},
			
			// 图片放大事件
			imageEvent (item,index) {
				this.enlargePhotoShow = true;
				this.enlargeImg = `${item}`
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
			
			// 搜索事件
			searchEvent () {
				if (this.textValue) {
					this.fileList = this.temporaryFileList.filter((item) => { return item.fileName.indexOf(this.textValue) != -1 || item.uploadAuthor.indexOf(this.textValue) != -1 || item.uploadDate.indexOf(this.textValue) != -1})
				} else {
					this.fileList = this.temporaryFileList
				}
			},
			
			// 查询文件列表
			getFilesList () {
				this.showLoadingHint = true;
				this.fileList = [];
				getFiles(this.workerId).then((res) => {
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.fileList.push({
									fileName: item.name,
									file: item.path,
									uploadAuthor: item.createName,
									uploadDate: item.createTime
								})
							};
							this.temporaryFileList = this.fileList
						} else {
							this.noDataShow = true
						}
					} else {
						this.$refs.uToast.show({
							title: `${res.data.data.msg}`,
							type: 'warning'
						});
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false
					this.$refs.uToast.show({
						title: `${err}`,
						type: 'error'
					})
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
					height: 600px;
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
		};
		.content-top-area {
			width: 96%;
			font-size: 0;
			height: 50px;
			align-items: center;
			margin: 0 auto;
			display: flex;
			flex-flow: row nowrap;
			.content-top-left {
				position: relative;
				flex: 1;
				margin-right: 6px;
				/deep/ .u-icon {
					position: absolute;
					left: 4px;
					top: 50%;
					transform: translateY(-50%)
				};
				/deep/ .u-input {
					padding: 0 10px 0 30px !important
				}
			};
			.content-top-right {
				>view {
					height: 32px;
					line-height: 32px;
					text-align: center;
					border-radius: 8px;
					font-size: 16px;
					color: #fff
				}
				.search {
					width: 60px;
					background: #1864ff
				}
			}
		};
		.content-bottom-area {
			width: 96%;
			margin: 0 auto;
			flex: 1;
			.file-list {
				padding: 8px 4px;
				box-sizing: border-box;
				@include bottom-border-1px(#c9c9c9);
				.file-list-top {
					color: black;
					word-break: break-all;
					font-size: 15px;
					margin-bottom: 8px
				};
				.file-list-bottom {
					display: flex;
					flex-flow: row nowrap;
					justify-content: space-between;
					color: #acaca8;
					font-size: 13px;
				}
			}
		}
	}	
</style>





