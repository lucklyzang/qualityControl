<template>
	<view class="container">
		<view class="bg-icon">
			<text>BLINK</text>
		</view>
		<view class="title-wrapper">
			<view class="project-manage" :class="qualityClass" @click="skipQualityPageManage" @touchstart="QualityManageTouchStart" @touchend="QualityManageTouchEnd">
				<view>
					<fa-icon type="wrench" size="100" color="#065da7"></fa-icon>
				</view>
				<text>质量管理系统</text>
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
		setCache,
		getCache
	} from '@/common/js/utils'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
		components: {
			faIcon
		},
		data() {
			return {
				qualityClass: ''
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: ''
			});
			uni.setNavigationBarColor({
				backgroundColor: '#00aaff',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		computed: {
			...mapGetters([
			])
		},
		mounted() {
			this.initStoreInfo()
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex'
			]),
			// 质量管理touchStart事件
			QualityManageTouchStart() {
				this.qualityClass = 'enlargeTransStyle'
			},
			
			// 质量管理touchEnd事件
			QualityManageTouchEnd() {
				this.qualityClass = 'shrinkTransStyle'
			},
			
			skipQualityPageManage () {
				uni.navigateTo({
					url: '/qualityPackage/pages/qualityManagement/index/index'
				});
			},
			initStoreInfo() {
				// 页面刷新时重新存入用户信息
				if (getCache('userInfo')) {
					this.$store.commit('storeUserInfo', getCache('userInfo'));
				};
				// 页面刷新重新存入请求token
				if (getCache('questToken')) {
					this.$store.commit('changeToken', getCache('questToken'));
				};
				// 页面刷新时重新存入用户权限信息
				if (getCache('permissionInfo')) {
				  this.$store.commit('changePermissionInfo',JSON.parse(getCache('permissionInfo')));
				};
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";

	.container {
		@include content-wrapper;
		font-size: 14px;

		.bg-icon {
			width: 100%;
			height: 190px;
			line-height: 190px;
			text-align: center;
			color: black;
			background: #fcfcfc;
			font-size: 26px;
			color: #2c9af1;
			font-weight: bold;
			font-size: 50px;

			span {
				box-shadow: 0 8px 6px -6px black
			}
		}

		;

		.title-wrapper {
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			font-size: 20px;
			color: #333;
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
			.enlargeTransStyle {
				animation: enlarge 0.2s linear both
			};
			.shrinkTransStyle {
				animation: shink 0.2s linear both
			};
			@keyframes enlarge {
				from {
					transform: scale3d(1, 1, 1);
				}

				to {
					transform: scale3d(1.3, 1.3, 1.3);
				}
			};
			@-webkit-keyframes shink {
				from {
					transform: scale3d(1.3, 1.3, 1.3);
				}
				to {
					transform: scale3d(1, 1, 1);
				}
			};
			>view {
				width: 180px;
				flex-basis: 180px;
				border-radius: 50%;
				color: black;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
				border: 1px solid #d6d3d3;
				box-shadow: 0 15px 10px -15px #6d6d6d;
				margin-bottom: 20px;
				&:last-child {
					margin-bottom: 0
				}
			};
			.center-transport {
				.fa-icon {
					color: $color-big-icon !important
				}
			};
			.project-manage {
				.fa-icon {
					color: $color-big-icon !important
				}
			}
		}
	}
</style>
