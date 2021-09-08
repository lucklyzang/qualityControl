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
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="检查记录" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="back-btn-box">
			<view @click="backTo">返 回</view>
		</view>
		<view class="time-shaft">
			<timeline>
				<timelineItem :leftTime="item.startTime" 
				:scrutator="item.scrutator" color="#2c9af1"
				:key="index"
				v-for="(item,index) in recordList"
				>
					<view class="tripItem">
						<view class="title" v-if="item.problemDescription">问题描述: {{item.problemDescription.replace('问题描述:','')}}</view>
						<view class="record-img" v-if="item.images">
							<text v-for="(innerItem,innerIndex) in item.images" :key="innerIndex"
							 @click="imageEvent(innerItem,innerIndex)"
							>
								<image :src="`http://blink.blinktech.cn/image/${innerItem}`">
							</text>
						</view>
						<view class="tips" v-if="item.remark">备注: {{item.remark.replace('备注:','')}}</view>
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
			this.taskTypeText = this.titleText;
			this.getItemDetails(this.subtaskInfo['taskItemId']);
			console.log('啥数据',this.subtaskInfo);
		},
		
		methods: {
			...mapMutations([
			]),
			
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
									problemDescription: item['describe'],
									remark: item['remarks'],
									images: item['images']
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
			
			// 图片放大事件
			imageEvent (item,index) {
				this.enlargePhotoShow = true;
				this.enlargeImg = `http://blink.blinktech.cn/image/${item}`
			},
			
			// 图片关闭事件
			closeImageEvent () {
				this.enlargePhotoShow = false
			},
			
			// 返回上一页
			backTo() {
				uni.navigateTo({
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
		/deep/ .u-model {
			height: 600px;
			padding: 15px;
			position: relative;
			box-sizing: border-box;
			.u-model__content {
				.slot-content {
					height: 580px;
					.u-icon {
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
				width: 80px;
				height: 40px;
				border-radius: 4px;
				text-align: center;
				line-height: 40px;
				color: #666;
				background: #e8e8e8
			}
		}
		.time-shaft {
			width: 96%;
			margin: 0 auto;
			overflow: auto;
			flex: 1;
			/deep/ .timeline {
				height: 100%
			};
			.tripItem {
					padding: 10px;
					box-sizing: border-box;
					background:rgba(255,255,255,1);
					box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
					border-radius:10px;
					margin-bottom: 30px;
					.title {
							font-size:14px;
							font-weight:500;
							color:rgba(51,51,51,1);
					}
					.record-img {
						display: flex;
						flex-flow: row wrap;
						margin-top: 10px;
						text {
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
			}
		}
	}	
</style>



