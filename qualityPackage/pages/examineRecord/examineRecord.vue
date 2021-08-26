<template>
	<view class="container">
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
						<view class="title">问题描述: {{item.problemDescription}}</view>
						<view class="tips">备注: {{item.remark}}</view>
						<view class="tips">质疑理由: {{item.queryReason}}</view>
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
				recordList: [
					{
						scrutator: '扎根三',
						startTime: '2020-01-01',
						problemDescription: '撒德哈打卡杀伤力的哈手机卡季后赛',
						remark: '飒飒飒飒飒飒',
						queryReason: '飒飒撒'
					},
					{
						scrutator: '阿萨飒',
						startTime: '2021-03-21',
						problemDescription: '撒德哈打卡杀伤力的哈手机卡季后赛',
						remark: '飒飒飒飒飒飒',
						queryReason: '飒飒撒'
					},
					{
						scrutator: '财政赤字',
						startTime: '2022-07-04',
						problemDescription: '撒德哈打卡杀伤力的哈手机卡季后赛',
						remark: '飒飒飒飒飒飒',
						queryReason: '飒飒撒'
					}
				]
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
			.tripItem {
					padding: 10px 20px;
					box-sizing: border-box;
					background:rgba(255,255,255,1);
					box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
					border-radius:10px;
					margin-bottom: 30px;
					.title {
							font-size:18px;
							font-weight:500;
							color:rgba(51,51,51,1);
					}
					.tips {
							font-size:14px;
							font-weight:400;
							color:rgba(153,153,153,1);
							margin-top: 20px;

					}
			}
		}
	}	
</style>



