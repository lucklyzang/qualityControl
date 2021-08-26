<template>
	<view class="container">
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
					<text>得分 (满分100) : </text>
				</view>
				<view class="right">
					<u-input v-model="gradeValue" placeholder="请输入分数" :border="true"  />
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
			<view class="problem-photo">
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
				problemDescribeValue: '',
				taskTypeText: '',
				content: '',
				remark: '',
				sureCancelShow: false,
				imgIndex: '',
				imgArr: []
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
			// 弹框确定按钮
			sureCancel() {
				this.imgArr.splice(this.imgIndex, 1)
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
			// 确认事件
			sure () {
				this.backTo()
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



