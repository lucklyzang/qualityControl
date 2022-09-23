<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#43c3f4" fontColor="#FFF" title="全部文件" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="content-top-area">
			<view class="content-top-left">
				<u-icon name="search" color="#e3e3e1" size="45"></u-icon>
				<u-input v-model="textValue" type="text" height="65" :border="true" placeholder="在全部文件中搜索" />
			</view>
			<view class="content-top-right">
				<view class="search" @click="searchEvent">搜索</view>
			</view>
		</view>
		<view class="content-bottom-area">
			<view class="file-list" v-for="(item,index) in fileList" :key="index">
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
				textValue: '',
				fileList: [
					{
						fileName: '手机卡洛杉矶卡卡撒撒娇萨斯喀里就是时间',
						uploadAuthor: '张新',
						uploadDate: '2021-03-24'
					},
					{
						fileName: '手机卡洛杉矶卡卡撒撒娇萨斯喀里就是时间',
						uploadAuthor: '张新',
						uploadDate: '2021-03-24'
					}
				],
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
			
			// 搜索事件
			searchEvent () {}
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
		.nav {
			width: 100%
		};
		.content-top-area {
			width: 96%;
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





