<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-modal v-model="sureCancelShow" :content="content" title="确定退出登录?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<ourLoading isFullScreen :active="showLoadingHint" :translateY="50" text="签退中,请稍候···" color="#fff" textColor="#fff"
		 background-color="rgb(143 143 143)" />
		<view class="nav">
			<nav-bar backState="2000" :home="false" bgColor="#2c9af1" fontColor="#FFF" title="个人资料" @backClick="backTo"></nav-bar>
		</view>
		<view class="content-top">
			<view class="content-top-name">
				<text>头像</text>
				<view>
					<image :src="juddgeAvatarUrl()">
				</view>
			</view>
			<view class="content-top-other">
				<text>姓名</text>
				<text>
					{{userName}}
				</text>
			</view>
			<view class="content-top-other">
				<text>手机号码</text>
				<text>
					无
				</text>
			</view>
			<view class="content-top-other">
				<text>科室名称</text>
				<text>
					{{depName}}
				</text>
			</view>
			<view class="content-top-other">
				<text>职位</text>
				<text>
					无
				</text>
			</view>
		</view>
		<view class="content-bottom">
			<view class="app-version">
				<text>当前版本</text>
				<text>
					{{versionNumber}}
				</text>
			</view>
			<view class="quit-account" @click="isLoginOut">退出账号</view>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import {
		userSignOut
	} from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				content: '',
				versionNumber: '2.2.7',
				sureCancelShow: false,
				showLoadingHint: false
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
				'userInfo'
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
		mounted() {
			console.log('信息',this.userInfo)
		},
		methods: {
			...mapMutations([
				'changeOverDueWay'
			]),

			// 返回上一页
			backTo() {
				uni.navigateTo({
					url: '/pages/centerTransport/index/index'
				})
			},

			// 判断头像
			juddgeAvatarUrl() {
				return '/static/img/default-person.jpg'
			},

			isLoginOut() {
				this.sureCancelShow = true
			},
			// 弹框确定事件
			sureCancel() {
				this.showLoadingHint = true;
				this.changeOverDueWay(true);
				setCache('storeOverDueWay', true);
				userSignOut(this.proId, this.workerId).then((res) => {
					if (res && res.data.code == 200) {
						removeAllLocalStorage();
					} else {
						this.$refs.uToast.show({
							title: `${res.data.msg}`,
							type: 'warning'
						});
						this.changeOverDueWay(false);
						setCache('storeOverDueWay', false)
					};
					this.showLoadingHint = false
				}).
				catch((err) => {
					this.$refs.uToast.show({
						title: `${err.message}`,
						type: 'warning'
					});
					this.changeOverDueWay(false);
					setCache('storeOverDueWay', false);
					this.showLoadingHint = false
				})
			},

			// 弹框取消事件
			cancelSure() {}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";

	.content-box {
		@include content-wrapper;

		.content-top {
			height: auto;
			font-size: 14px;
			background: #fff;

			.content-top-name {
				height: 90px;
				padding: 10px;
				box-sizing: border-box;
				position: relative;
				@include bottom-border-1px($color-underline);

				>text {
					position: absolute;
					display: inline-block;
					left: 0;
					top: 38px;
					color: $color-text-left;
					padding-left: 10px
				}

				;

				>view {
					position: absolute;
					color: #271010;
					font-weight: bold;
					right: 10px;
					top: 10px;
					width: 65px;
					height: 65px;
					border-radius: 50%;

					image {
						width: 100%;
						height: 100%
					}
				}
			}

			;

			.content-top-otherone {
				height: 100px
			}

			;

			.content-top-other {
				height: 45px;
				line-height: 45px;
				box-sizing: border-box;
				position: relative;
				@include bottom-border-1px($color-underline);

				&:last-child {
					@include bottom-border-1px(#fff);
				}

				>text {
					position: absolute;
					display: inline-block;

					&:first-child {
						left: 0;
						top: 0;
						color: $color-text-left;
						padding-left: 10px;
					}

					;

					&:last-child {
						color: $color-text-right;
						font-weight: bold;
						right: 10px;
						top: 0
					}
				}
			}
		}

		;

		.content-bottom {
			flex: 1;
			margin: 0 auto;
			width: 100%;
			font-size: 13px;
			background: #f6f6f6;
			position: relative;

			.app-version {
				position: relative;
				top: 14px;
				left: 0;
				height: 45px;
				background: #fff;
				line-height: 45px;
				box-sizing: border-box;

				>text {
					position: absolute;
					display: inline-block;

					&:first-child {
						left: 0;
						top: 0;
						color: $color-text-left;
						padding-left: 10px;
					}

					;

					&:last-child {
						color: $color-text-right;
						font-weight: bold;
						right: 10px;
						top: 0
					}
				}
			}

			;

			.back-home {
				height: 45px;
				width: 300px;
				margin: 0 auto;
				line-height: 45px;
				left: 50%;
				margin-left: -150px;
				position: absolute;
				bottom: 100px;
				background: #fff;
				color: #271010;
				font-weight: bold;
				text-align: center
			}

			;

			.quit-account {
				height: 45px;
				width: 300px;
				margin: 0 auto;
				line-height: 45px;
				left: 50%;
				margin-left: -150px;
				position: absolute;
				bottom: 30px;
				background: #ff0000;
				color: #fff;
				font-weight: bold;
				text-align: center
			}
		}
	}
</style>
