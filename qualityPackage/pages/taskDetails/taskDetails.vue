<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#4993f5" fontColor="#FFF" title="检查详情" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="content-top-area">
			<image :src="statusBackgroundPng"></image>
		</view>
		<view class="content-bottom-area">
			<view class="details-tilte">
				<u-icon name="order" color="orange" size="35"></u-icon>
				<text>
					{{`${taskMessage.year}年${taskMessage.examinationTime}${taskMessage.checkName}${taskMessage.examinationType}检查`}}
				</text>
			</view>
			<view class="details-content">
				<view class="item-line">
					<text>编号:</text>
					<text>{{taskMessage.serialNumber}}</text>
				</view>
				<view class="item-line">
					<text>考核项目:</text>
					<text>{{taskMessage.examinationItem}}</text>
				</view>
				<view class="item-line">
					<text>检查内容:</text>
					<text>{{taskMessage.checkName}}</text>
				</view>
				<view class="item-line">
					<text>类型:</text>
					<text>{{taskMessage.examinationType}}</text>
				</view>
				<view class="item-line">
					<text>考核年份:</text>
					<text>{{taskMessage.year}}</text>
				</view>
				<view class="item-line">
					<text>考核时间:</text>
					<text>{{taskMessage.examinationTime}}</text>
				</view>
				<view class="item-line">
					<text>检查开始时间:</text>
					<text>{{taskMessage.examinationStartTime}}</text>
				</view>
				<view class="item-line">
					<text>质疑截止时间:</text>
					<text>{{taskMessage.questionTime}}</text>
				</view>
				<view class="item-line">
					<text>检查结束时间:</text>
					<text>{{taskMessage.finishTime}}</text>
				</view>
				<view class="item-line">
					<text>整改结束时间:</text>
					<text>{{taskMessage.reformTime}}</text>
				</view>
				<view class="item-line">
					<text>评价方式:</text>
					<text>{{evaluationMethodTransfer(taskMessage.assessmentFormat)}}</text>
				</view>
				<view class="item-line">
					<text>是否允许质疑:</text>
					<text>{{queryTransfer(taskMessage.isQuery)}}</text>
				</view>
				<view class="item-line">
					<text>满分:</text>
					<text>{{taskMessage.fullMark}}</text>
				</view>
				<view class="item-line">
					<text>任务负责人:</text>
					<text>{{taskMessage.examinationPrincipal}}</text>
				</view>
				<view class="item-line">
					<text>子任务负责人:</text>
					<text>{{extractPrincipal(taskMessage.subPersons)}}</text>
				</view>
				<view class="item-line">
					<text>检查陪同人:</text>
					<text>{{taskMessage.companion ? taskMessage.companion : ''}}</text>
				</view>
				<view class="item-line">
					<text>备注:</text>
					<text>{{taskMessage.remark}}</text>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="quit-account" @click="backEvent">返 回</view>
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
				infoText: '加载中',
				statusBackgroundPng: require("@/static/img/status-background.png"),
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'taskMessage',
				'subtaskInfo',
				'selectHospitalList',
				'enterTaskDetailsSource'
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
			
			// 截取字符串
			cutStr (str) {
				let strIndex = str.indexOf('_');
				if (strIndex != -1) {
					return str.substr(strIndex + 1)
				};
				return str
			},
			
			//提取负责人
			extractPrincipal (data) {
				let temporaryData = [];
				for (let item of data) {
					temporaryData.push(item.name)
				};
				return temporaryData.join(";")
			},
			
			// 是否允许质疑转换
			queryTransfer (index) {
			  switch(index) {
					case 0 :
					return '允许'
					break;
					case 1 :
					return '允许'
					break;
			  }
			},
			
			// 评价方式
			evaluationMethodTransfer (index) {
				 switch(index) {
					case 1 :
					return '打分'
					break;
			  }
			},
			
			// 判断字符串是否以指定字符开头和结尾
			confirmEnding (str, targetOne, targetTwo) {
				if(str.indexOf(targetOne) === 0 && str.lastIndexOf(targetTwo) === str.length - 1){
						return true
				};
			  return false
			},
	
			// 返回上一页
			backTo() {
				uni.redirectTo({
					url: this.enterTaskDetailsSource
				})
			},
			
			backEvent() {
				uni.redirectTo({
					url: this.enterTaskDetailsSource
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
		.nav {
			width: 100%
		};
		.content-top-area {
			width: 100%;
			z-index: 1000;
			height: 160px;
			>image {
				width: 100%;
				height: 100%;
			}
		};
		.content-bottom-area {
			width: 94%;
			margin: 0 auto;
			margin-top: -150px;
			padding: 10px 20px 0 20px;
			box-sizing: border-box;
			flex: 1;
			background: #fff;
			border: 1px solid #f2f2f2;
			box-shadow: 0px 1px 3px 0 #93b4f7;
			z-index: 1000;
			border-radius: 8px;
			.details-tilte {
				>text {
					margin-left: 4px;
					font-size: 16px;
					font-weight: bold
				}
			};
			.details-content {
				margin-top: 6px;
				.item-line {
					font-size: 14px;
					width: 100%;
					line-height: 25px;
					word-break: break-all
				}
			}
		};
		.bottom-btn {
			height: 100px;
			margin: 0 auto;
			margin-top: 20px;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-top;
			font-size: 13px;
			position: relative;
			.quit-account {
				height: 45px;
				width: 260px;
				font-size: 16px;
				margin: 0 auto;
				line-height: 45px;
				background: linear-gradient(to right, #6cd2f8, #2390fe);
				color: #fff;
				border-radius: 20px;
				font-weight: bold;
				text-align: center
			}
		}
	}	
</style>




