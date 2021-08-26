<template>
	<view class="container">
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="检查项详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="score-box">
			<text>得分: </text>
			<text>未评价</text>
		</view>
		<view class="operite-btn-box">
			<view @click="gradeEvent">满分</view>
			<view @click="gradeEvent">扣分</view>
			<view @click="gradeEvent">不参评</view>
		</view>
		<!-- <view class="operite-query-btn-box">
			<view @click="gradeEvent">重新评价</view>
			<view @click="gradeEvent">驳回</view>
		</view>
		<view class="operite-query-btn-box">
			<view @click="gradeEvent">通过</view>
			<view @click="gradeEvent">不通过</view>
		</view> -->
		<view class="examine-content-box">
			<view class="examine-items-number">
				<text>检查项编号: </text>
				<text>飒飒飒飒</text>
			</view>
			<view class="score">
				<text>分数: </text>
				<text>90</text>
			</view>
			<view class="examine-describe">
				<text>检查描述: </text>
				<text>的撒大苏打实打实的你</text>
			</view>
			<view class="examine-describe">
				<text>标准参考: </text>
				<text>的撒大苏打实打实的你</text>
			</view>
			<view class="examine-describe">
				<text>考核内容: </text>
				<text>的撒大苏打实打实的你的似的是的</text>
			</view>
		</view>
		<view class="btn-box">
			<text @click="enterRecord">检查记录</text>
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
				taskTypeText: ''
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
			
			// 进入检查记录页
			enterRecord () {
				uni.navigateTo({
					url: '/qualityPackage/pages/examineRecord/examineRecord'
				})
			},
			// 进入评分页
			gradeEvent () {
				uni.navigateTo({
					url: '/qualityPackage/pages/grade/grade'
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
			> view {
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
			> view {
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
			> view {
				line-height: 30px;
				height: 30px;
				overflow: auto;
				> text {
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


